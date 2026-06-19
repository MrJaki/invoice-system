import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import api from '../lib/api'
import { useEffect, useState } from "react";
import Message from "./Message";

const margin = { right: 24 };
const xLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Maj',
    'Jun',
    'Jul',
    'Avg',
    'Sep',
    'Okt',
    'Nov',
    'Dec'
];

export default function SimpleLineChart(start: any) {
    const [totalRevenue, setTotalRevenue] = useState<number[]>([])
    const [totalUnpaid, setTotalUnpaid] = useState<number[]>([]);
    const [totalAmount, setTotalAmount] = useState<number[]>([]);

    // Constants used for displaying message
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    const loadBills = async () => {
        if (start.year === '' || start.year == null) return;
        try {
            const year = start.year.split('-')[0];

            const bill = await api.get(
                `${API_URL}/bills/whole-year`,
                {
                    params: {
                        year: year,
                    }
                }
            );
            const data = Array.isArray(bill.data.data)
                ? bill.data.data
                : [bill.data.data];

            const revenue = data.map(
                (z: {skupni_znesek: string}) => Number(z.skupni_znesek)
            )
            const unpaid = data.map(
                (z: {neplacano: string}) => Number(z.neplacano)
            )
            const amount = data.map(
                (z: {neplacano: number, skupni_znesek: number}) => Number(z.skupni_znesek - z.neplacano)
            )

            setTotalRevenue(revenue);
            setTotalUnpaid(unpaid);
            setTotalAmount(amount);


            setIsVisible(false);
            setIsError(false);
            setMessage("");
        } catch (err: any) {
            setIsVisible(true);
            setIsError(true);
            setMessage(
                err.response?.data?.error ||
                err.message ||
                "Prišlo je do napake pri nalaganju grafa!"
            );
        }
    }

    useEffect(() => {
        loadBills();
    }, [start])

    return (
        <>
        <Message error={isError} visible={isVisible}>{message}</Message>
        <Box sx={{ width: '100%', height: 300 }}>
            <p className='text-sm font-small text-gray-500'>Prikazujejo se vrednosti za račune iz leta, ki ga označuje spodnji vnos za datum "Datum valute do"</p>
            
            <LineChart
                series={[
                    { data: totalRevenue, label: 'Skupna plačila', color: '#21bd1b' },
                    { data: totalUnpaid, label: 'Neplačano', color: 'red' },
                    { data: totalAmount, label: 'Dobiček', color: 'blue' },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels, height: 28 }]}
                yAxis={[{ width: 50 }]}
                margin={margin}
            />
        </Box>
        </>
    );
}
