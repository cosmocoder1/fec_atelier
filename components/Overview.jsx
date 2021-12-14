import React from 'react';
import AddToCart from '../subcomponents/overview/AddToCart.jsx';
import ImageGallery from '../subcomponents/overview/ImageGallery.jsx';
import ProductInfo from '../subcomponents/overview/ProductInfo.jsx';
import StyleSelector from '../subcomponents/overview/StyleSelector.jsx';

class Overview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    console.log('component did mount');
  }

  handleChange() {

    // passes state changes (featured item) up to central App state for coordination
    // with other widgets when needed

  }

  componentDidMount() {
     console.log('component did mount');
  }

  render() {

    return (
      <div id={'overview'}>
        <ProductInfo props={this.state}/>
        <ImageGallery props={this.state}/>
        <StyleSelector props={this.state}/>
        <AddToCart props={this.state}/>
      </div>
    )

  }

}

export default Overview;