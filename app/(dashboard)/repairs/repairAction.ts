'use server';

import { revalidatePath } from 'next/cache';
import { getAuthToken } from '@/lib/auth';

// Type definitions to match Go backend models
export interface RepairStatus {
  ID: number;
  RepairID: number;
  Status: string; // "analyzing", "repairing", "ready to pickup"
  UpdatedAt: string;
  UpdatedBy: string;
}

export interface Repair {
  ID: number;
  UserEmail: string; // Changed from UserId to UserEmail
  UserPhone: string; // Added phone number field
  RepairStatus: RepairStatus[];
  Product: string;
  Category: string;
  CreatedAt: string;
  UpdatedAt: string;
  Description: string;
}

// Response type with pagination data
export interface RepairResponse {
  data: Repair[];
  count: number;
  page: number;
  limit: number;
}

// Function to fetch all repairs with pagination
export async function getRepairs(page: number = 1, limit: number = 5) {
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
      `http://localhost:8080/repairs?page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
        headers
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data as RepairResponse; // Return full response with pagination info
  } catch (error) {
    console.error('Error fetching repairs:', error);
    return { data: [], count: 0, page: page, limit: limit };
  }
}

// Function to fetch a specific repair by ID
export async function getRepairById(id: number) {
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

    const response = await fetch(`http://localhost:8080/repairs/${id}`, {
      cache: 'no-store',
      headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data as Repair;
  } catch (error) {
    console.error(`Error fetching repair with ID ${id}:`, error);
    return null;
  }
}

// Function to create a new repair
export async function createRepair(formData: FormData) {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const repairData = {
      UserEmail: formData.get('userEmail') as string, // Changed from userId to userEmail
      UserPhone: formData.get('userPhone') as string, // Added phone field
      Product: formData.get('product') as string,
      Category: formData.get('category') as string,
      Description: formData.get('description') as string
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8080/repairs', {
      method: 'POST',
      headers,
      body: JSON.stringify(repairData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/repairs');
    return { success: true };
  } catch (error) {
    console.error('Error creating repair:', error);
    return { success: false, error };
  }
}

// Function to update a repair
export async function updateRepair(formData: FormData) {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const repairId = formData.get('repairId') as string;

    const repairData = {
      UserEmail: formData.get('userEmail') as string, // Changed from userId to userEmail
      UserPhone: formData.get('userPhone') as string, // Added phone field
      Product: formData.get('product') as string,
      Category: formData.get('category') as string,
      Description: formData.get('description') as string
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:8080/repairs/${repairId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(repairData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/repairs');
    return { success: true };
  } catch (error) {
    console.error('Error updating repair:', error);
    return { success: false, error };
  }
}

// Function to delete a repair
export async function deleteRepair(repairId: number) {
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

    const response = await fetch(`http://localhost:8080/repairs/${repairId}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/repairs');
    return { success: true };
  } catch (error) {
    console.error('Error deleting repair:', error);
    return { success: false, error };
  }
}

// Function to add a new repair status
export async function createRepairStatus(formData: FormData) {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const statusData = {
      RepairID: Number(formData.get('repairId')),
      Status: formData.get('status') as string,
      UpdatedBy: formData.get('updatedBy') as string
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8080/repair-statuses', {
      method: 'POST',
      headers,
      body: JSON.stringify(statusData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/repairs');
    return { success: true };
  } catch (error) {
    console.error('Error creating repair status:', error);
    return { success: false, error };
  }
}

// Function to update a repair status
export async function updateRepairStatus(formData: FormData) {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const statusId = formData.get('statusId') as string;

    const statusData = {
      Status: formData.get('status') as string,
      UpdatedBy: formData.get('updatedBy') as string
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:8080/repair-statuses/${statusId}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(statusData)
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/repairs');
    return { success: true };
  } catch (error) {
    console.error('Error updating repair status:', error);
    return { success: false, error };
  }
}
