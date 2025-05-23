import Header from "./components/header";
import HomePage from "./components/home";


export default function Home() {
  return (
    <div className=" w-full h-screen flex flex-col">
      <Header />
      <HomePage />
    </div>
  );
}
