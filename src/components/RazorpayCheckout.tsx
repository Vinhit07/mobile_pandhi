import React, { useRef, useState, useEffect } from 'react';
import { Modal, StyleSheet, ActivityIndicator, View, Platform, Text, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

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
    const webViewRef = useRef<WebView>(null);

    useEffect(() => {
        if (visible) {
            setIsLoading(true);
        }
    }, [visible]);

    const checkoutHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <style>
                body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                .loader { text-align: center; color: #666; }
            </style>
        </head>
        <body>
            <div id="loader" class="loader">Starting Payment...</div>
            <script src="https://checkout.razorpay.com/v1/checkout.js" onerror="handleScriptError()"></script>
            <script>
                function handleScriptError() {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', code: 'SCRIPT_LOAD_ERROR', description: 'Failed to load Razorpay SDK' }));
                }

                var options = {
                    "key": "${keyId}",
                    "amount": "${amount}", 
                    "currency": "INR",
                    "name": "UPS",
                    "description": "${description}",
                    "order_id": "${orderId}",
                    "prefill": {
                        "name": "${prefillName}",
                        "email": "${prefillEmail}"
                    },
                    "theme": {
                        "color": "#FF6B35"
                    },
                    "modal": {
                        "ondismiss": function(){
                            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'DISMISS'}));
                        }
                    },
                    "handler": function (response){
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
                        rzp1.on('payment.failed', function (response){
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'ERROR',
                                code: response.error.code,
                                description: response.error.description
                            }));
                        });
                        rzp1.open();
                        document.getElementById('loader').style.display = 'none';
                    } catch (e) {
                         window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', code: 'INIT_ERROR', description: e.message }));
                    }
                }

                // Wait for SDK to load
                if (typeof Razorpay !== 'undefined') {
                    startPayment();
                } else {
                    var checkInterval = setInterval(function() {
                        if (typeof Razorpay !== 'undefined') {
                            clearInterval(checkInterval);
                            startPayment();
                        }
                    }, 100);
                    // Timeout fallback
                    setTimeout(function() {
                        if (typeof Razorpay === 'undefined') {
                            handleScriptError();
                        }
                    }, 10000);
                }
            </script>
        </body>
        </html>
    `;

    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('[RazorpayCheckout] Message:', data);

            if (data.type === 'SUCCESS') {
                onSuccess(data);
            } else if (data.type === 'DISMISS') {
                onDismiss();
            } else if (data.type === 'ERROR') {
                console.error('[RazorpayCheckout] Error:', data);
                Alert.alert('Payment Error', data.description || 'Something went wrong');
                onDismiss();
            }
        } catch (e) {
            console.error('[RazorpayCheckout] Parse error:', e);
        }
    };

    if (!visible) return null;

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
                    source={{ html: checkoutHTML, baseUrl: 'https://razorpay.com' }}
                    onMessage={handleMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loader}>
                            <ActivityIndicator size="large" color="#FF6B35" />
                            <Text style={styles.loadingText}>Loading Payment Gateway...</Text>
                        </View>
                    )}
                    onLoadEnd={() => setIsLoading(false)}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.warn('WebView error: ', nativeEvent);
                        Alert.alert('Network Error', 'Failed to load payment gateway. Please check your internet connection.');
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
});

export default RazorpayCheckout;
