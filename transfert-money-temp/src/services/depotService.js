import axios from 'axios';


export const effectuerDepot = async ({ numeroCompte, montant }) => {
  const res = await axios.post('https://application-minibank-agent.onrender.com/api/comptes/depot', {
    numeroCompte,
    montant: parseFloat(montant)
  });
  return res.data;
};

export const fetchHistorique = async () => {
  const res = await axios.get('https://application-minibank-agent.onrender.com/historique');
  return res.data;
};
