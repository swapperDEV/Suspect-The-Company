'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchStockData } from '@/lib/api';

const StockChart = dynamic(() => import('@/components/StockChart'), {
  ssr: false,
});

const HomePage = () => {
  const [companyName, setCompanyName] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('1mo'); 
  const [interval, setInterval] = useState('1d'); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStockData(null);

    try {
      const data = await fetchStockData(companyName, period, interval);
      setStockData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analiza Akcji</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Wpisz nazwę firmy lub ticker"
          className="border p-2 rounded mr-2"
        />

        <label htmlFor="period" className="mr-2">
          Okres:
          <select id="period" value={period} onChange={handlePeriodChange} className="border p-2 rounded">
            <option value="1d">1 dzień</option>
            <option value="5d">5 dni</option>
            <option value="1mo">1 miesiąc</option>
            <option value="3mo">3 miesiące</option>
            <option value="6mo">6 miesięcy</option>
            <option value="1y">1 rok</option>
            <option value="2y">2 lata</option>
            <option value="5y">5 lat</option>
            <option value="10y">10 lat</option>
            <option value="ytd">Od początku roku (YTD)</option>
            <option value="max">Maksimum</option>
          </select>
        </label>

        <label htmlFor="interval">
          Interwał:
          <select id="interval" value={interval} onChange={handleIntervalChange} className="border p-2 rounded">
            <option value="1m">1 minuta</option>
            <option value="2m">2 minuty</option>
            <option value="5m">5 minut</option>
            <option value="15m">15 minut</option>
            <option value="30m">30 minut</option>
            <option value="60m">60 minut</option>
            <option value="90m">90 minut</option>
            <option value="1h">1 godzina</option>
            <option value="1d">1 dzień</option>
            <option value="5d">5 dni</option>
            <option value="1wk">1 tydzień</option>
            <option value="1mo">1 miesiąc</option>
            <option value="3mo">3 miesiące</option>
          </select>
        </label>

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Szukaj
        </button>
      </form>

      {loading && <p>Ładowanie...</p>}
      {error && <p className="text-red-500">Błąd: {error}</p>}

      {stockData && stockData.stockData.length > 0 && (
        <StockChart stockData={stockData.stockData} smaData={stockData.smaData} />
      )}
    </main>
  );
};

export default HomePage;