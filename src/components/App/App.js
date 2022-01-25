// import axios from 'axios';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import React, { Component } from 'react';
import { getImageWithQuery } from '../../PixabayApi/pixabayApi';
import { Button } from '../Button/Button';
import { Searchbar } from '../Searchbar/Searchbar';
import { ImageGallery } from '../ImageGallery/ImageGallery';

const status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class App extends Component {
  state = {
    imageName: '',
    gallery: [],
    status: status.IDLE,
    page: 1,
  };

  async componentDidUpdate(prevPropse, prevState) {
    try {
      const nextName = this.state.imageName;
      const prevName = prevState.imageName;
      const nextPage = this.state.page;
      const prevPage = prevState.page;

      if (nextName !== prevName || nextPage !== prevPage) {
        this.setState({ status: status.PENDING });
        await this.createGallery(this.state.page);
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleFormSubmite = imageName => {
    this.setState({ imageName });
  };

  createGallery = async page => {
    const { imageName } = this.state;

    try {
      this.setState({ status: status.PENDING });

      const { hits } = await getImageWithQuery(imageName, page);

      if (hits.length === 0) {
        console.log('Sory, there are no image');
        return;
      }

      this.setState(prevState => ({
        gallery: [...prevState.gallery, ...hits],
      }));

      this.setState({ status: status.RESOLVED });
    } catch (error) {
      console.log(error.message);
    }
  };

  onLoadMorePictures = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { status, gallery } = this.state;

    return (
      <div>
        <Searchbar onSubmit={this.handleFormSubmite} />
        <ImageGallery galleryList={gallery} status={status} />
        {status === 'resolved' && (
          <Button onLoadMore={this.onLoadMorePictures} />
        )}
      </div>
    );
  }
}
