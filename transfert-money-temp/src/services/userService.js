import axios from 'axios';

export const fetchUtilisateurs = async () => {
  const res = await axios.get("https://application-minibank-agent.onrender.com/api/utilisateurs");
  return res.data;
};

export const createUtilisateur = async (data) => {
  const res = await axios.post('https://application-minibank-agent.onrender.com/api/utilisateurs', data);
  return res.data;
};


export const updateUser = (id, data) =>
  axios.put(`https://application-minibank-agent.onrender.com/api/utilisateurs/${id}`, data);

export const archiveUser = (id) =>
  axios.patch(`https://application-minibank-agent.onrender.com/api/utilisateurs/${id}/archive`);

export const blockUser = (id) =>
  axios.patch(`https://application-minibank-agent.onrender.com/api/utilisateurs/${id}/block`);
export const unblockUser = (id) =>
  axios.put(`https://application-minibank-agent.onrender.com/api/utilisateurs/${id}`, { is_blocking: false });
export const unarchiveUser = (id) =>
  axios.put(`https://application-minibank-agent.onrender.com/api/utilisateurs/${id}`, { is_archived: false });
export const deleteUser = (id) =>
  axios.delete(`https://application-minibank-agent.onrender.com/api/utilisateurs/${id}`);



