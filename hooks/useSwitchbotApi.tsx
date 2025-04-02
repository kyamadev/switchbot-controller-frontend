import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSnackbar } from './useSnackbar';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useSwitchbotApi() {
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const getHeaders = () => {
    const access = Cookies.get('access');
    return { 
      Authorization: `Bearer ${access}`,
      'Content-Type': 'application/json' 
    };
  };

  const handleError = (error: any, defaultMessage: string) => {
    console.error(error);
    const message = error.response?.data?.detail || defaultMessage;
    showSnackbar(message, 'error');
    return null;
  };

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/control/`, { headers: getHeaders() });
      return res.data.devices;
    } catch (error) {
      return handleError(error, 'Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceStatus = async (deviceId: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/control/${deviceId}`, { headers: getHeaders() });
      return res.data;
    } catch (error) {
      return handleError(error, 'Failed to fetch device status');
    } finally {
      setLoading(false);
    }
  };

  const sendCommand = async (deviceId: string, command: string, param?: string) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/control/${deviceId}/${command}/`, 
        param ? { param } : {}, 
        { headers: getHeaders() }
      );
      showSnackbar(`Command ${command} sent successfully`, 'success');
      return res.data;
    } catch (error) {
      return handleError(error, 'Failed to send command');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchDevices,
    fetchDeviceStatus,
    sendCommand
  };
}