import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './api';

export interface Ticket {
    id: string;
    ticketNumber: string;
    title: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'open' | 'closed' | 'pending';
    progress: string;
    progressPercentage: number;
    dateIssued: string;
    resolvedDate?: string;
    resolutionNote?: string;
    issueType: string;
}

export interface CreateTicketData {
    title: string;
    description: string;
    priority: string;
    issueType?: string;
}

export const getTickets = async (): Promise<{ ongoing: Ticket[], completed: Ticket[] }> => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_BASE_URL}/customer/outlets/tickets`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const tickets = response.data.tickets || {};
        return {
            ongoing: Array.isArray(tickets.ongoing) ? tickets.ongoing : [],
            completed: Array.isArray(tickets.completed) ? tickets.completed : []
        };
    } catch (error) {
        console.error('Error fetching tickets:', error);
        // Return empty arrays on error instead of throwing to prevent app crash
        return { ongoing: [], completed: [] };
    }
};

export const createTicket = async (data: CreateTicketData): Promise<Ticket> => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.post(`${API_BASE_URL}/customer/outlets/tickets/create`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.ticket;
    } catch (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }
};

export const getTicketDetails = async (ticketId: string): Promise<Ticket> => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_BASE_URL}/customer/outlets/tickets/${ticketId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.ticket;
    } catch (error) {
        console.error('Error fetching ticket details:', error);
        throw error;
    }
};
