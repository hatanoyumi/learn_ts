// import { NextPage } from "next";
// import { useEffect, useState } from "react";


// const IndexPage: NextPage = () => {
//   // useStateを使って状態を定義
//   const [imageUrl, setImageUrl] = useState("");
//   const [loading, setLoading] = useState(true);

//   // マウント時に画像を読み込む宣言
//   useEffect(() => {
//     fetchImage().then((newImage) => {
//       setImageUrl(newImage.url); //画像URLの状態を更新
//       setLoading(false); //ローディング状態を更新
//     });
//   }, []); //最後の[]（第２引数）には「コンポーネントがマウントされたときのみ実行する」という重要な役割があるので省略しない

//   // ボタンをクリックしたときに画像を読み込む
//   const handleClick = async () => {
//     setLoading(true); // 読込中のフラグを立てる
//     const newImage = await fetchImage();
//     setImageUrl(newImage.url); // 画像URLの状態を更新
//     setLoading(false); // 読込中フラグを倒す
//   };

//   // ローディング中でなければ画像を表示（||は論理和演算子。loadingがfalseのときに<img>要素を表示）
//   return (
//     <>
//       <button onClick={handleClick}>他のにゃんこも見る</button>
//       <div>{loading || <img src={imageUrl} width="400px" />}</div>
//     </>
//   );
// };

// export default IndexPage;

// type Image = {
//   url: string;
// };

// const fetchImage = async (): Promise<Image> => {
//   const res = await fetch("https://api.thecatapi.com/v1/images/search");
//   const images = await res.json();

//   console.log(images);
//   return images[0];
// };

/*
JSXの式で条件分岐するには論理演算子や三項演算子を使う必要がある（if「文」は「式」じゃないから使えない）
<div>
  {loaded && <img src="..." />} ── 論理積演算子
  {loading || <img src="..." />} ── 論理和演算子
  {loading ? "読み込み中" : <img src="..." />} ── 三項演算子
</div>;
*/

// ***************************************************************
// getServerSidePropsを使って、サーバーサイドで初期画像を取得するように変更

import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";


// getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
};

// ページコンポーネント関数にpropsを受け取る引数を追加
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl); // 初期値を渡す
  const [loading, setLoading] = useState(false); // 初期状態はfalseにしておく

  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>他のにゃんこも見る(自動デプロイテスト)</button>
      <div className={styles.frame}>{loading || <img src={imageUrl} className={styles.img} />}</div>
    </div>
  );
};

export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();

  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

type Image = {
  url: string;
};

const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();
  console.log(images);
  return images[0];
};
