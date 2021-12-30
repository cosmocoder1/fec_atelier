import React from 'react';
import $ from 'jquery';

class ImageZoom extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentImageIndex: 0,
      selectedStyle: props.selectedStyle,
      featureImage: props.featureImage,
      newGallery: [],
      zoom: false
    }

    this.handleImageChange = this.handleImageChange.bind(this);
    this.zoomClick = this.zoomClick.bind(this);
    this.closeZoom = this.closeZoom.bind(this);
    this.unpackImages = this.unpackImages.bind(this);

  }

  componentDidMount() {
    this.unpackImages();
  }

  componentDidUpdate() {
    if (this.props.selectedStyle !== this.state.selectedStyle) {
      this.setState({
        ...this.state,
        selectedStyle: this.props.selectedStyle
      }, () => {
        this.unpackImages();
      })
    }
  }


  unpackImages() {

    var styleImages = this.state.selectedStyle.photos;
    var galleryURLs = [];
    var galleryIsNew = false;

    for (var i = 0; i < styleImages.length; i++) {
      galleryURLs.push(styleImages[i].thumbnail_url);
    }

    for (var i = 0; i < styleImages.length; i++) {
      if (this.state.newGallery[i] !== styleImages[i].url) {
        galleryIsNew = true;
      }
    }

    if (galleryIsNew === true || this.state.newGallery.length === 0 ) {

      this.setState({
        ...this.state,
        newGallery: galleryURLs
      }, () => {
        //console.log('state thumbnails => ', this.state.thumbGallery)
        var i = this.state.featureImage;
        var scrollBox = $('.thumbnailScroll');
        scrollBox.children('div').eq(i).css('border', '1px solid black');
      })

    }

  }


  handleImageChange(e) {

    // receives clicked dot index and sets currentImageIndex
    var value = Number(e.target.innerHTML[30]);

    this.setState({
      ...this.state,
      featureImage: value,
    })

  }

  zoomClick() {

    var zoomedImg = $('#zoomedImage');

    if (this.state.zoom === false) {
      zoomedImg.css('transform', 'scale(2.5)');
      zoomedImg.css('cursor', 'zoom-out');
      this.setState({
        ...this.state,
        zoom: true
      })
    } else if (this.state.zoom === true) {
      zoomedImg.css('transform', 'scale(1)');
      zoomedImg.css('cursor', 'zoom-in');
      this.setState({
        ...this.state,
        zoom: false
      })
    }

  }

  closeZoom() {
    this.props.closeZoom();
  }

  // map-render index dots w/click handlers

  render() {

    return (

      <div id={'zoomView'}>
        <div id={'xOutZoom'} onClick={this.closeZoom}>x</div>
        <img id={'zoomedImage'} onClick={this.zoomClick} src={this.state.newGallery[this.state.featureImage]}/>
        <div>{this.state.newGallery.map((item, i) => (
          <div key={i} className={'scrollDot'} onClick={this.handleImageChange}>.<span className={'invisibleIndex'}>{i}</span></div>
        ))
        }</div>
      </div>
    )

  }

}


export default ImageZoom;