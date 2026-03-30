import { useParams, useNavigate } from 'react-router-dom';
import books from '../data/books.json';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find(b => b.id === Number(id));

  if (!book) return <div>Book not found.</div>;

  return (
    <div className="book-detail">
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      <p>Chapter {book.chapter}</p>
    </div>
  );
}

export default BookDetail;