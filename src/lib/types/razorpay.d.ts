export {};

declare global {
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;

    handler?: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => void;

    modal?: {
      ondismiss?: () => void;
      escape?: boolean;
      backdropclose?: boolean;
      handleback?: boolean;
      confirm_close?: boolean;
      animation?: boolean;
    };

    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };

    theme?: {
      color?: string;
    };
  }

  interface RazorpayInstance {
    open(): void;
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
