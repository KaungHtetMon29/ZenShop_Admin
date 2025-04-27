'use server';

import { auth } from '@/lib/auth';
import { getAuthToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { Order, OrderResponse, CheckoutRequest } from '../order';

// Function to fetch all orders with pagination
export async function fetchOrders(
  page: number = 1,
  limit: number = 5
): Promise<OrderResponse> {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const headers: HeadersInit = {
      'Cache-Control': 'no-store'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:8080/orders?page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
        headers
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { data: [], count: 0, page: page, limit: limit };
  }
}

// Function to fetch a specific order by ID
export async function fetchOrderById(orderId: number): Promise<Order> {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const headers: HeadersInit = {};

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:8080/orders/${orderId}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`Error fetching order: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

// Function to add a new order
export async function addOrder(formData: FormData) {
  try {
    // Get session data and JWT token
    const session = await auth();
    const token = await getAuthToken();

    const orderData = {
      UserId: formData.get('userId'),
      CreatedAt: new Date().toISOString().split('T')[0],
      Payment: {
        Amount: Number(formData.get('amount')),
        Type: formData.get('paymentType'),
        CardholderName: formData.get('cardholderName'),
        CardNumberLast4: formData.get('cardNumberLast4'),
        ExpiryDate: formData.get('expiryDate'),
        CreatedAt: new Date().toISOString().split('T')[0]
      },
      Shipping: {
        Address: formData.get('address'),
        FirstName: formData.get('firstName'),
        LastName: formData.get('lastName'),
        City: formData.get('city'),
        State: formData.get('state'),
        ZipCode: formData.get('zipCode'),
        Country: formData.get('country'),
        Email: formData.get('email') || '',
        Phone: formData.get('phone'),
        CreatedAt: new Date().toISOString().split('T')[0]
      }
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8080/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    console.error('Error adding order:', error);
    return { success: false, error };
  }
}

// Function to update an existing order
export async function updateOrder(formData: FormData) {
  try {
    const session = await auth();
    // Get JWT token
    const token = await getAuthToken();

    const orderId = formData.get('orderId');
    const orderData = {
      UserId: formData.get('userId'),
      Payment: {
        Amount: Number(formData.get('amount')),
        Type: formData.get('paymentType'),
        CardholderName: formData.get('cardholderName'),
        CardNumberLast4: formData.get('cardNumberLast4'),
        ExpiryDate: formData.get('expiryDate')
      },
      Shipping: {
        Address: formData.get('address'),
        FirstName: formData.get('firstName'),
        LastName: formData.get('lastName'),
        City: formData.get('city'),
        State: formData.get('state'),
        ZipCode: formData.get('zipCode'),
        Country: formData.get('country'),
        Email: formData.get('email') || '',
        Phone: formData.get('phone')
      }
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:8080/orders/${orderId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error };
  }
}

// Function to delete an order
export async function deleteOrder(orderId: number) {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:8080/orders/${orderId}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    return { success: false, error };
  }
}

// Function to add a product to an order
export async function addProductToOrder(formData: FormData) {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const productOrderData = {
      OrderID: Number(formData.get('orderId')),
      ProductID: Number(formData.get('productId')),
      Quantity: Number(formData.get('quantity')),
      CreatedAt: new Date().toISOString().split('T')[0]
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8080/product-orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(productOrderData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    console.error('Error adding product to order:', error);
    return { success: false, error };
  }
}

// Function to delete a product from an order
export async function deleteProductFromOrder(productOrderId: number) {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:8080/product-orders/${productOrderId}`,
      {
        method: 'DELETE',
        headers
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product from order:', error);
    return { success: false, error };
  }
}

// Function to handle checkout process
export async function processCheckout(checkoutData: CheckoutRequest) {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8080/checkout', {
      method: 'POST',
      headers,
      body: JSON.stringify(checkoutData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status}. ${errorText}`);
    }

    const data = await response.json();
    revalidatePath('/orders');
    return { success: true, data };
  } catch (error) {
    console.error('Error processing checkout:', error);
    return { success: false, error };
  }
}
