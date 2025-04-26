'use server';

import { revalidatePath } from 'next/cache';

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

// Function to fetch all repairs
export async function getRepairs() {
  try {
    const response = await fetch('http://localhost:8080/repairs', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data as Repair[];
  } catch (error) {
    console.error('Error fetching repairs:', error);
    return [];
  }
}

// Function to fetch a specific repair by ID
export async function getRepairById(id: number) {
  try {
    const response = await fetch(`http://localhost:8080/repairs/${id}`, {
      cache: 'no-store'
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
    const repairData = {
      UserEmail: formData.get('userEmail') as string, // Changed from userId to userEmail
      UserPhone: formData.get('userPhone') as string, // Added phone field
      Product: formData.get('product') as string,
      Category: formData.get('category') as string,
      Description: formData.get('description') as string
    };

    const response = await fetch('http://localhost:8080/repairs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
    const repairId = formData.get('repairId') as string;

    const repairData = {
      UserEmail: formData.get('userEmail') as string, // Changed from userId to userEmail
      UserPhone: formData.get('userPhone') as string, // Added phone field
      Product: formData.get('product') as string,
      Category: formData.get('category') as string,
      Description: formData.get('description') as string
    };

    const response = await fetch(`http://localhost:8080/repairs/${repairId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
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
    const response = await fetch(`http://localhost:8080/repairs/${repairId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
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
    const statusData = {
      RepairID: Number(formData.get('repairId')),
      Status: formData.get('status') as string,
      UpdatedBy: formData.get('updatedBy') as string
    };

    const response = await fetch('http://localhost:8080/repair-statuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
    const statusId = formData.get('statusId') as string;

    const statusData = {
      Status: formData.get('status') as string,
      UpdatedBy: formData.get('updatedBy') as string
    };

    const response = await fetch(
      `http://localhost:8080/repair-statuses/${statusId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
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
