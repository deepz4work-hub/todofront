
import './App.css';
import MainPage from './components/MainPage';
import { TodoProvider } from './context/TodoContext';

function App() {
  return (
    <div className="container-fluid">
      <TodoProvider>
        <MainPage/>
      </TodoProvider>
    </div>
  );
}

export default App;
