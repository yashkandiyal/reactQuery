import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

const App = () => {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const queryClient = useQueryClient();
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to fetch todos");
    }
  };
  // Mutating data simply means we are changing something in the database, we could be posting, creating, or deleting something.

  // useMutation hook is used for "write" operations (creating, updating, and deleting data).

  //'tododata' is used as the identifier for this cache
  //If useQuery is called again with the same key while the data is still in the cache, React Query will return the cached data instead of performing a new fetch.
  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["tododata"],
    queryFn: fetchData,
  });
  const mutation = useMutation({
    mutationFn: () => {
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({ title, userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      //queryClient.invalidateQueries({ queryKey: ["todosdata"] }). This means that after a successful mutation, any cached data associated with the "todosdata" query key will be invalidated, and the next time the data is requested using this key, it will be refetched from the server, ensuring that the client has the most up-to-date data.

      queryClient.invalidateQueries({ queryKey: ["tododata"] });
    },
  });
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleUserIdChange = (e) => setUserId(e.target.value);

  if (isLoading || mutation.isLoading) {
    return <span>Loading...</span>;
  }

  if (isError || mutation.isError) {
    return <span>Error: Failed to fetch or submit data</span>;
  }
  const submitData = () => {
    mutation.mutate({ title, userId });
  };
  return (
    <div>
      <div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
        />
        <input
          type="number"
          value={userId}
          onChange={handleUserIdChange}
          placeholder="UserId"
        />
        <button onClick={submitData}>Submit</button>
      </div>
      {isSuccess && (
        <>
          {todos.map((item, index) => (
            <div key={index}>
              <h1>{item.userId}</h1>
              <h2>{item.title}</h2>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default App;
