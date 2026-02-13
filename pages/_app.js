import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Suryachalam V M | Portfolio</title>
        <meta name="description" content="Portfolio of Suryachalam V M, a Frontend Web Developer Intern and B.Sc. Mathematics & Computer Science student." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
