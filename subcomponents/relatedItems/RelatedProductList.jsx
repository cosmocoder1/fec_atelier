import React from 'react';
import {ProductCard} from './ProductCard.jsx';




var mockRelatedItems = [
  {picture: 'sample', category: 'shirt', price: '50', rating: 4},
  {picture: 'sample', category: 'pants', price: '197', rating: 3.8},
  {picture: 'sample', category: 'jacket', price: '79', rating: 2.2},
  {picture: 'sample', category: 'hat', price: '99', rating: 1.5},
  {picture: 'sample', category: 'scarf', price: '47', rating: 5},
  {picture: 'sample', category: 'socks', price: '25', rating: 3.6},

]


export class RelatedProductList extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <>
        <h3>list of related products</h3>
        <div>
          {mockRelatedItems.map(item => {
            return <ProductCard clickCard={this.props.clickCard} clickStar={this.props.clickStar} itemInfo={item}/>
          })}
        </div>
      </>
    )
  }
}
//<ProductCard clickCard={this.props.clickCard} clickStar={this.props.clickStar} />