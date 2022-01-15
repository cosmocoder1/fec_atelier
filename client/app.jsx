import React from 'react';
import ReactDOM from 'react-dom';
import Overview from '../components/Overview.jsx';
import QuestionsAndAnswers from '../components/QuestionsAndAnswers.jsx';
import RatingsAndReviews from '../components/RatingsAndReviews.jsx';
import RelatedItems from '../components/RelatedItems.jsx';
import Search from '../components/Search.jsx';


import $ from 'jquery';
import { APIkey } from '../config.js';

// importing search bar icon from react library
import { FaSistrix } from 'react-icons/fa';
import parseAverageRating from '../modules/parseRatings.js';
import mockProduct from '../mock_api/mock_product.js';
import mockStyles from '../mock_api/mock_styles.js';
import getPercentRecommended from '../modules/percentRecommended.js';

import Promise from 'bluebird';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      productId: 59553,
      product: null,
      styles: null,
      ratings: null,
      averageRating: null,
      percentRecommended: null,
      allRelated: [],
      outfitIds: [],
      outfits: [],
      outfitView: [],
      outfitPosition: 0,
    }

    this.retrieveProduct = this.retrieveProduct.bind(this);
    this.retrieveStyles = this.retrieveStyles.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.loadState = this.loadState.bind(this);

    this.retrieveRelatedProducts = this.retrieveRelatedProducts.bind(this);
    this.retrieveAllForRelated = this.retrieveAllForRelated.bind(this);
    this.retrieveAllForOutfits = this.retrieveAllForOutfits.bind(this);
    this.handleRelatedCardClick = this.handleRelatedCardClick.bind(this);
    this.addToOutfit = this.addToOutfit.bind(this);
    this.removeFromOutfits = this.removeFromOutfits.bind(this);
    this.handleRightArrow = this.handleRightArrow.bind(this);
    this.handleLeftArrow = this.handleLeftArrow.bind(this);

    this.retrieveRatings = this.retrieveRatings.bind(this);
  }

  componentDidMount() {

    this.loadState();
    // this.retrieveProduct(this.state.productId);
    // this.retrieveRelatedProducts(this.state.productId);
    // this.retrieveRatings();

  }

  componentDidUpdate() {

  }

  loadState() {

    var promises = [];

    // retrieve Product
    var product = new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `products/${this.state.productId}`
      }).done((res) => {
        resolve(res);
      })
    })

    // retrieve Styles
    var styles = new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `styles/${this.state.productId}`
      }).done((res) => {
        resolve(res);
      })
    })

    // retrieve Ratings
    var ratings = new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews/?product_id=${this.state.productId}`,
        headers: {
          "Authorization": APIkey
        }
      }).done((res) => {
        resolve(res);
      })
    })

    // retrieve Related Product Id's
    var related = new Promise((resolve, reject) => {
      $.ajax({
        method: 'GET',
        url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${this.state.productId}/related`,
        headers: {
          "Authorization": APIkey
        }
      }).done((res) => {
        resolve(res);
      })

    })

    // retrieve Related Products
    var getRelatedItems = (ids) => {

      var ids = ids.join('&');

      return new Promise((resolve, reject) => {

        $.ajax({
          method: 'GET',
          url: `related/${ids}`,
          success: (data) => {
            resolve(data);
          },
          error: (err) => {
            console.log('error getting all for related', err)
          }
        })
      })

    }

    var getRelatedForOutfits = (ids) => {

      var ids = ids.join('&');

      return new Promise((resolve, reject) => {

    $.ajax({
      method: 'GET',
      url: `outfits/${ids}`,
      success: (data) => {
        var threeAtATime = data.slice(0, 3);
        resolve([data, threeAtATime])
      },
      error: (err) => {
        console.log('error getting outfit data', err);
      }
    })

      })

    }



    var productState;
    var stylesState;
    var ratingsState;
    var allRelatedState;
    var relatedData;
    var outfitsState;
    var outfitViewState;

    product.then(data => {
      productState = data;
    }).then(() => {
      return styles;
    }).then((data) => {
      stylesState = data;
    }).then(() => {
      return ratings;
    }).then((data) => {
      ratingsState = data;
    }).then(() => {
      return related;
    }).then((data) => {
      relatedData = data;
      return getRelatedItems(data);
    }).then((data) => {
      allRelatedState = data;
    }).then(() => {
      return getRelatedForOutfits(relatedData);
    }).then((data) => {
      outfitsState = data[0];
      outfitViewState = data[1];
    }).then(() => {

      this.setState({
        ...this.state,
      product: productState,
      styles: stylesState,
      ratings: ratingsState,
      averageRating: parseAverageRating(ratingsState),
      percentRecommended: getPercentRecommended(ratingsState),
      allRelated: allRelatedState,
      outfitIds: [],
      outfits: outfitsState,
      outfitView: outfitViewState,
      outfitPosition: 0,
      })

    })




  }



  retrieveProduct(id) {

    var self = this;

    $.ajax({
      method: 'GET',
      url: `products/${id}`
    }).done((res) => {
      this.retrieveStyles(res, this.state.productId);
    })

  }


  retrieveStyles(product, productNumber) {
    var self = this;

    $.ajax({
      method: 'GET',
      url: `styles/${productNumber}`
    }).done((res) => {
      self.setState({
        ...self.state,
        product: product,
        styles: res,
      }, () => {
        //console.log('state styles => ', self.state.styles);
      })
    })

  }

  retrieveRatings() {

    var self = this;

    $.ajax({
      method: 'GET',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews/?product_id=${this.state.productId}`,
      headers: {
        "Authorization": APIkey
      }
    }).done((res) => {
      self.setState({
        ...self.state,
        ratings: res,
      }, () => {
        self.setState({
          ...self.state,
          averageRating: parseAverageRating(this.state.ratings)
        }, () => {
          self.setState({
            ...self.state,
            percentRecommended: getPercentRecommended(this.state.ratings)
          }, () => {
            // console.log('percent recommended: ', this.state.percentRecommended);
          })
        })
      })
    })

  }

  // now available for use - must use string parameter with product name
  // not case sensitive but spelling must be correct
  handleSearch(searchTerm) {

    //console.log('search toggled')

    $.ajax({
      method: 'GET',
      url: `search/${searchTerm}`,
    }).done((res) => {
      this.setState({
        ...this.state,
        productId: res
      }, () => {
        $('.searchInput').val('');
        this.retrieveProduct(this.state.productId);
      })
    })

  }




  retrieveRelatedProducts(productId) {
    $.ajax({
      method: 'GET',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/products/${this.state.productId}/related`,
      headers: {
        "Authorization": APIkey
      },
      success: (data) => {
        this.retrieveAllForRelated(data);
        if (this.state.outfits.length > 0) {
          this.retrieveAllForOutfits(this.state.outfits)
        }
      },
      error: (err) => {
        console.log('error getting related products', err);
      }
    })
  }

  retrieveAllForRelated(ids) {

    var ids = ids.join('&');

    $.ajax({
      method: 'GET',
      url: `related/${ids}`,
      success: (data) => {
        this.setState({
          allRelated: data
        }, () => { })
      },
      error: (err) => {
        console.log('error getting all for related', err)
      }
    })
  }

  retrieveAllForOutfits(ids) {
    var ids = ids.join('&');
    $.ajax({
      method: 'GET',
      url: `outfits/${ids}`,
      success: (data) => {
        var threeAtATime = data.slice(0, 3);
        this.setState({
          outfits: data,
          outfitView: threeAtATime,
        }, () => { })
      },
      error: (err) => {
        console.log('error getting outfit data', err);
      }
    })
  }


  handleRelatedCardClick(e) {
    var clickedCardId = e.currentTarget.getAttribute('data-txt');
    this.setState({
      productId: clickedCardId,
      allRelated: []
    }, () => {
      this.retrieveProduct(this.state.productId);
      this.retrieveStyles(this.state.productId);
      this.retrieveRelatedProducts(this.state.productId);
      this.retrieveRatings();

    }
    )
  }

  addToOutfit() {
    if (this.state.outfitIds.indexOf(this.state.productId) === -1) {
      var outfits = this.state.outfitIds.concat(this.state.productId);
      this.setState({
        outfitIds: outfits,
      }, () => {
        this.retrieveAllForOutfits(this.state.outfitIds);
      })
    }
  }

  removeFromOutfits(e) {
    e.stopPropagation();
    var id = e.currentTarget.getAttribute('data-txt');
    var outfitIds = this.state.outfitIds;
    var targetIndex = outfitIds.indexOf(Number(id));
    var splicedOutfitIds = outfitIds.splice(targetIndex, 1);
    var outfits = this.state.outfits;
    var listIndex;
    var outfitView = this.state.outfitView;
    var viewIndex;
    outfits.forEach((item, index) => {
      if (item.id === Number(id)) {
        listIndex = index;
      }
    });
    outfits.splice(listIndex, 1);
    outfitView.forEach((item, index) => {
      if (item.id === Number(id)) {
        viewIndex = index;
      }
    });
    outfitView.splice(viewIndex, 1);
    this.setState({
      outfitIds: outfitIds,
      outfits: outfits,
      outfitView: viewIndex,
    }, () => { })
  }

  handleLeftArrow() {
    var newPosition;
    if (this.state.outfitPosition > 0) {
      newPosition = this.state.outfitPosition - 1;
    } else {
      newPosition = 0;
    }
    var newView = this.state.outfits.slice(newPosition, newPosition + 3);
    this.setState({
      outfitPosition: newPosition,
      outfitView: newView
    })

  }

  handleRightArrow() {
    var newPosition;
    if (this.state.outfitPosition < this.state.outfits.length - 3) {
      newPosition = this.state.outfitPosition + 1;
    } else {
      newPosition = this.state.outfits.length - 3;
    }
    var newView = this.state.outfits.slice(newPosition, newPosition + 3);
    this.setState({
      outfitPosition: newPosition,
      outfitView: newView
    })

  }

  render() {

    return (
      <div>
        <div className={'topBar'}>
          <div className={'pageTitle'}>ATELIER</div>
          <div className={'searchUnit'}>
            <Search handleSearch={this.handleSearch} />
            <div className={'searchFieldUnderline'} />
          </div>
        </div>
        <div className={'siteAnnouncementBar'}>
          <div className={'announcement'}><i>SITE-WIDE ANNOUNCEMENT MESSAGE!</i> - SALE / DISCOUNT <b>OFFER</b> - NEW PRODUCT HIGHLIGHT</div>
        </div>
        <div>{this.state.product && this.state.styles ? <Overview product={this.state.product} styles={this.state.styles} rating={this.state.averageRating} /> : null}</div>
        {this.state.allRelated.length > 0 ? <RelatedItems all={this.state.allRelated} outfits={this.state.outfitView} clickCard={this.handleRelatedCardClick} addOutfit={this.addToOutfit} remove={this.removeFromOutfits} name={this.state.product} right={this.handleRightArrow} left={this.handleLeftArrow} position={this.state.outfitPosition} /> : null}
        <QuestionsAndAnswers />
        <div className="ratingsAndReviews">
          {this.state.ratings ? <RatingsAndReviews reviews={this.state.ratings} averageRating={this.state.averageRating} percent={this.state.percentRecommended} /> : null}
        </div>
      </div>
    )
  }
}

export default App;
