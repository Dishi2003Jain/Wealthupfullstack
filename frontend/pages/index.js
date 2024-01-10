import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css'

const CodeInput = () => {
  const [inputCode, setInputCode] = useState('');
  const [message, setMessage] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  
  useEffect(() => {
    fetchGeneratedCode();
  }, []);

  const fetchGeneratedCode = async () => {
    try {
      const response = await axios.get('https://wealthup-backend2.onrender.com/api/codes');
      if (response.status === 200) {
        setGeneratedCode(response.data.code || '');
      } else {
        console.error(response.data.error || 'Error fetching generated code');
      }
    } catch (error) {
      console.error('An error occurred while fetching generated code:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://wealthup-backend2.onrender.com/api/codes/use', {
        code: inputCode
      });
  
      if (response.status === 200) {
        setMessage(response.data.message || '');
      } else {
        setMessage(response.data.error || 'Error occurred');
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error || 'Server Error');
      } else if (error.request) {
        setMessage('No response received from server');
      } else {
        setMessage('Error processing the request');
      }
    }
  };
  
  const handleRefreshCode = () => {
    fetchGeneratedCode();
  };

  // ... (other code remains the same)

return (
  <div className={styles.container}>
    <div className={styles.content}>
      <div className={styles.codeSection}>
        <p className={styles.generatedCode}>Code: {generatedCode}</p>
        <button onClick={handleRefreshCode} className={styles.refreshButton}>Refresh Code</button>
      </div>
      <input
        type="text"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        placeholder="Enter code"
        className={styles.input}
      />
      <button onClick={handleSubmit} className={styles.submitButton}>Submit</button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  </div>
);
};

export default CodeInput;
