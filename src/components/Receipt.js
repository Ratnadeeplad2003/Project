import React, { useState } from 'react';
import Axios from 'axios';

const DownloadReceipt = ({ prnNumber }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadReceipt = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await Axios.get(`http://localhost:5000/api/receipts/${prnNumber}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${prnNumber}_receipt.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setLoading(false);
    } catch (err) {
      setError('Failed to download receipt. Please try again later.');
      setLoading(false);
      console.error('Error fetching receipt:', err);
    }
  };

  return (
    <div className="my-4">
      {error && <p className="text-danger">{error}</p>}
      
      <button
        className="btn btn-primary"
        onClick={downloadReceipt}
        disabled={loading}
      >
        {loading ? 'Downloading...' : 'Download Receipt (PDF)'}
      </button>
    </div>
  );
};

export default DownloadReceipt;
