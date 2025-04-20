import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useMutation } from "@apollo/client";

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS);

  if (!props.show) {
    return null;
  }

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const authors = result.data ? result.data.allAuthors : [];

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.target.name.value;
          const born = parseInt(e.target.born.value);
          editAuthor({
            variables: { name, setBornTo: born },
          });
          e.target.name.value = "";
          e.target.born.value = "";
        }}
      >
        <div>
          Author
          <select name="name">
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          Born
          <input name="born" type="number" />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
