import axios from 'axios';

export const annulerTransaction = async (numero_transaction, motif, agent) => {
  const res = await axios.put("https://application-minibank-agent.onrender.com/api/transactions/annuler/${numero_transaction", {
    motif,
    agent
  });
  return res.data;
};

export const fetchTransactions = async () => {
  const res = await axios.get('https://application-minibank-agent.onrender.com/api/transactions');
  return res.data;
};
