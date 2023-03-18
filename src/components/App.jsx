import React, { useEffect, useRef, useState } from 'react';
import SearchBar from './Searchbar';
import fetchAPI from './API';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageGallery } from './ImageGallery';
import Modal from './Modal';
import { Loader } from './Loader';
import { LoadMore } from './LoadMore';
import { noRes, err, fin } from './warnings';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [totalHits, setTotalHits] = useState(null);
  const [status, setStatus] = useState('idle');
  const [modalImage, setModalImage] = useState(null);
  const [alt, setAlt] = useState(null);

  const queryRef = useRef();
  const pageRef = useRef();

  useEffect(() => {
    if (query !== '') {
      fetch();
      pageRef.current = page;
      queryRef.current = query;
    }
    //бесконечный фетч если добавить images. Зависимости ведь не обязательно указывать как еслинт просит?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  async function fetch() {
    if (pageRef.current !== page || queryRef.current !== query) {
      setStatus('pending');
    }
    try {
      const imageData = await fetchAPI(query, page);
      setTotalHits(imageData.totalHits);
      const imagesHits = imageData.hits;
      if (imagesHits.length === 0) {
        noRes();
      }

      setImages(prevState => [...prevState, ...imagesHits]);
      setStatus('resolved');
    } catch (error) {
      err(error);
      setStatus('rejected');
    } finally {
      fin(page, totalHits);
    }
  }

  const onSubmit = query => {
    setQuery('');
    setPage(1);
    setImages([]);
    setStatus('idle');
    setModalImage(null);
    setAlt(null);
    setQuery(query);
  };

  const incrementPage = () => {
    setPage(page + 1);
  };

  const onSelectedImg = (largeImageUrl, tags) => {
    setModalImage(largeImageUrl);
    setAlt(tags);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <>
      <SearchBar onSubmit={onSubmit} />

      {images.length > 0 && (
        <ImageGallery images={images} modalImage={onSelectedImg} />
      )}

      {images.length > 0 && images.length !== totalHits && (
        <LoadMore onClick={incrementPage} />
      )}

      {modalImage !== null && (
        <Modal modalImage={modalImage} tags={alt} onClose={closeModal} />
      )}

      {status === 'pending' && <Loader />}
      <ToastContainer />
    </>
  );
}
