
export default function UserContextReducer(state, { type, payload }) {
  switch (type) {
    case "LOGIN":
      return { ...payload };
    case "LOGOUT":
      return { login: false, auth: payload.auth, user: null };
    case "SET_AUTH": 
      return { login: false, auth: payload.auth, user: null }
    default:
      return state;
  }
}