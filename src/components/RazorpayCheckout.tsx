import React, { useRef, useCallback } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

// Conditionally import WebView for native platforms
let WebView: any = null;
if (Platform.OS !== 'web') {
    try {
        WebView = require('react-native-webview').WebView;
    } catch (e) {
        console.warn('react-native-webview not available');
    }
}

interface RazorpayCheckoutProps {
    visible: boolean;
    orderId: string;
    amount: number; // in paise
    keyId: string;
    description?: string;
    prefillEmail?: string;
    prefillName?: string;
    onSuccess: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
    onDismiss: () => void;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
    visible,
    orderId,
    amount,
    keyId,
    description = 'Quick Byte Payment',
    prefillEmail = '',
    prefillName = '',
    onSuccess,
    onDismiss,
}) => {
    const webViewRef = useRef<any>(null);

    const checkoutHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #1A1A1A;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            color: #fff;
        }
        .loading {
            text-align: center;
        }
        .loading .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #3A3A3A;
            border-top: 3px solid #FF6B35;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading p { color: #9A9A9A; font-size: 14px; }
        .error { text-align: center; padding: 24px; }
        .error h3 { color: #FF5252; margin-bottom: 8px; }
        .error p { color: #9A9A9A; font-size: 14px; }
    </style>
</head>
<body>
    <div class="loading" id="loading">
        <div class="spinner"></div>
        <p>Opening payment gateway...</p>
    </div>
    <div class="error" id="error" style="display:none;">
        <h3>Payment Failed</h3>
        <p id="errorMsg">Something went wrong</p>
    </div>

    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script>
        function startPayment() {
            var options = {
                key: '${keyId}',
                amount: ${amount},
                currency: 'INR',
                name: 'Quick Byte',
                description: '${description}',
                order_id: '${orderId}',
                prefill: {
                    email: '${prefillEmail}',
                    name: '${prefillName}'
                },
                theme: {
                    color: '#FF6B35',
                    backdrop_color: '#1A1A1A'
                },
                modal: {
                    ondismiss: function() {
                        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'DISMISSED'
                        }));
                    }
                },
                handler: function(response) {
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SUCCESS',
                        data: {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }
                    }));
                }
            };

            try {
                var rzp = new Razorpay(options);
                rzp.on('payment.failed', function(response) {
                    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'FAILED',
                        error: response.error.description || 'Payment failed'
                    }));
                });
                rzp.open();
            } catch(e) {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('error').style.display = 'block';
                document.getElementById('errorMsg').textContent = e.message || 'Failed to open payment gateway';
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'ERROR',
                    error: e.message
                }));
            }
        }

        // Wait for Razorpay script to load
        if (typeof Razorpay !== 'undefined') {
            startPayment();
        } else {
            document.querySelector('script[src*="razorpay"]').addEventListener('load', startPayment);
        }
    </script>
</body>
</html>`;

    const handleWebMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            switch (data.type) {
                case 'SUCCESS':
                    onSuccess(data.data);
                    break;
                case 'DISMISSED':
                case 'FAILED':
                case 'ERROR':
                    onDismiss();
                    break;
            }
        } catch (e) {
            console.warn('[RazorpayCheckout] Failed to parse message:', e);
        }
    }, [onSuccess, onDismiss]);

    // Web platform: use iframe
    if (Platform.OS === 'web') {
        if (!visible) return null;

        return (
            <Modal
                visible={visible}
                animationType="slide"
                transparent
                onRequestClose={onDismiss}
            >
                <View style={styles.overlay}>
                    <View style={styles.webContainer}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Payment</Text>
                            <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color={Colors.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <iframe
                            srcDoc={checkoutHTML}
                            style={{
                                flex: 1,
                                width: '100%',
                                border: 'none',
                                backgroundColor: '#1A1A1A',
                            } as any}
                            title="Razorpay Checkout"
                        />
                    </View>
                </View>
            </Modal>
        );
    }

    // Mobile platform: use WebView
    if (!WebView || !visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Payment</Text>
                        <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color={Colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                    <WebView
                        ref={webViewRef}
                        source={{ html: checkoutHTML }}
                        onMessage={handleWebMessage}
                        javaScriptEnabled
                        domStorageEnabled
                        startInLoadingState
                        renderLoading={() => (
                            <View style={styles.loading}>
                                <ActivityIndicator size="large" color={Colors.primary} />
                            </View>
                        )}
                        style={styles.webView}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    container: {
        height: '85%',
        backgroundColor: Colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    webContainer: {
        height: '85%',
        backgroundColor: Colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    closeBtn: {
        padding: 4,
    },
    webView: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
});

export default RazorpayCheckout;
