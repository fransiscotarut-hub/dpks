
export default function ModelsContextReducer(state, { type, payload }) {
  switch (type) {
    case "SET_MODELS":
      return { ...payload };
    default:
      return state;
  }
}