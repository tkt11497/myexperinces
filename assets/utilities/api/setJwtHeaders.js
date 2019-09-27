const setJwtHeaders = jwt => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`
  }
});

export default setJwtHeaders;
