import React, { useRef, useState, useEffect } from 'react';
import { Modal, StyleSheet, ActivityIndicator, View, Platform, Text, TouchableOpacity, Alert } from 'react-native';

// Only import WebView on native platforms
let WebView: any = null;
if (Platform.OS !== 'web') {
    try {
        WebView = require('react-native-webview').WebView;
    } catch (e) {
        console.warn('[RazorpayCheckout] react-native-webview not available');
    }
}

interface RazorpayCheckoutProps {
    visible: boolean;
    orderId: string;
    amount: number; // in paise
    keyId: string;
    description: string;
    prefillEmail: string;
    prefillName: string;
    onSuccess: (data: any) => void;
    onDismiss: () => void;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
    visible,
    orderId,
    amount,
    keyId,
    description,
    prefillEmail,
    prefillName,
    onSuccess,
    onDismiss,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const webViewRef = useRef<any>(null);
    const onSuccessRef = useRef(onSuccess);
    const onDismissRef = useRef(onDismiss);
    const razorpayOpenedRef = useRef(false);

    // Keep refs in sync with latest props
    useEffect(() => { onSuccessRef.current = onSuccess; }, [onSuccess]);
    useEffect(() => { onDismissRef.current = onDismiss; }, [onDismiss]);

    useEffect(() => {
        if (visible) {
            setIsLoading(true);
            razorpayOpenedRef.current = false;
        }
    }, [visible]);

    // ─── Web: Load Razorpay SDK and open checkout directly ───
    useEffect(() => {
        if (Platform.OS !== 'web' || !visible || razorpayOpenedRef.current) return;
        razorpayOpenedRef.current = true;

        const loadAndOpen = async () => {
            try {
                // Load Razorpay SDK if not already loaded
                if (!(window as any).Razorpay) {
                    await new Promise<void>((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                        script.onload = () => resolve();
                        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
                        document.head.appendChild(script);
                    });
                }

                setIsLoading(false);

                // Open Razorpay checkout
                const options = {
                    key: keyId,
                    amount: String(amount),
                    currency: 'INR',
                    name: 'Quick Byte',
                    description: description,
                    order_id: orderId,
                    prefill: {
                        name: prefillName,
                        email: prefillEmail,
                    },
                    theme: { color: '#FF6B35' },
                    modal: {
                        ondismiss: () => {
                            console.log('[RazorpayCheckout] Dismissed by user');
                            onDismissRef.current();
                        },
                    },
                    handler: (response: any) => {
                        console.log('[RazorpayCheckout] Payment success:', response);
                        onSuccessRef.current({
                            type: 'SUCCESS',
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                    },
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.on('payment.failed', (response: any) => {
                    console.error('[RazorpayCheckout] Payment failed:', response.error);
                    alert('Payment Failed: ' + (response.error?.description || 'Payment was not successful'));
                    onDismissRef.current();
                });
                rzp.open();
            } catch (error) {
                console.error('[RazorpayCheckout] Error:', error);
                alert('Failed to load payment gateway. Check your internet connection.');
                onDismissRef.current();
            }
        };

        loadAndOpen();
    }, [visible, orderId, amount, keyId, description, prefillEmail, prefillName]);

    // ─── Web: No modal needed, Razorpay opens its own overlay ───
    if (Platform.OS === 'web') {
        if (!visible) return null;

        if (isLoading) {
            return (
                <View style={styles.webLoader}>
                    <ActivityIndicator size="large" color="#FF6B35" />
                    <Text style={styles.loadingText}>Loading Payment Gateway...</Text>
                </View>
            );
        }

        return null; // Razorpay manages its own UI on web
    }

    // ─── Native: use WebView ───
    if (!visible) return null;

    if (!WebView) {
        return (
            <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Payment</Text>
                        <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.loader}>
                        <Text style={styles.errorText}>WebView not available. Please install react-native-webview.</Text>
                    </View>
                </View>
            </Modal>
        );
    }

    const nativeCheckoutHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            .loader { text-align: center; color: #666; }
        </style>
    </head>
    <body>
        <div id="loader" class="loader"><p>Starting Payment...</p></div>
        <script src="https://checkout.razorpay.com/v1/checkout.js" onerror="handleScriptError()"></script>
        <script>
            function handleScriptError() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', code: 'SCRIPT_LOAD_ERROR', description: 'Failed to load Razorpay SDK' }));
            }
            var options = {
                "key": "${keyId}",
                "amount": "${amount}",
                "currency": "INR",
                "name": "Quick Byte",
                "description": "${description}",
                "order_id": "${orderId}",
                "prefill": { "name": "${prefillName}", "email": "${prefillEmail}" },
                "theme": { "color": "#FF6B35" },
                "modal": {
                    "ondismiss": function(){ window.ReactNativeWebView.postMessage(JSON.stringify({type: 'DISMISS'})); }
                },
                "handler": function(response){
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SUCCESS',
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    }));
                }
            };
            function startPayment() {
                try {
                    var rzp1 = new Razorpay(options);
                    rzp1.on('payment.failed', function(response){
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'ERROR', code: response.error.code, description: response.error.description
                        }));
                    });
                    rzp1.open();
                    document.getElementById('loader').style.display = 'none';
                } catch (e) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', code: 'INIT_ERROR', description: e.message }));
                }
            }
            if (typeof Razorpay !== 'undefined') { startPayment(); }
            else {
                var check = setInterval(function(){ if (typeof Razorpay !== 'undefined') { clearInterval(check); startPayment(); } }, 100);
                setTimeout(function(){ if (typeof Razorpay === 'undefined') handleScriptError(); }, 10000);
            }
        </script>
    </body>
    </html>`;

    const handleNativeMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('[RazorpayCheckout] Message:', data);

            if (data.type === 'SUCCESS') {
                onSuccess(data);
            } else if (data.type === 'DISMISS') {
                onDismiss();
            } else if (data.type === 'ERROR') {
                Alert.alert('Payment Error', data.description || 'Something went wrong');
                onDismiss();
            }
        } catch (e) {
            console.error('[RazorpayCheckout] Parse error:', e);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Completing Payment</Text>
                    <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                </View>

                <WebView
                    ref={webViewRef}
                    source={{ html: nativeCheckoutHTML, baseUrl: 'https://razorpay.com' }}
                    onMessage={handleNativeMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color="#FF6B35" />
                            <Text style={styles.loadingText}>Loading Payment Gateway...</Text>
                        </View>
                    )}
                    onError={(syntheticEvent: any) => {
                        console.warn('WebView error: ', syntheticEvent.nativeEvent);
                        Alert.alert('Network Error', 'Failed to load payment gateway.');
                    }}
                    originWhitelist={['*']}
                    style={{ flex: 1 }}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'ios' ? 40 : 10,
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        padding: 8,
    },
    closeText: {
        color: '#FF6B35',
        fontWeight: '600',
    },
    loader: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    webLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    errorText: {
        color: '#E53E3E',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});

export default RazorpayCheckout;
