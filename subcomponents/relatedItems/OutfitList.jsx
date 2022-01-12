import React from 'react';
import {OutfitCard} from './OutfitCard.jsx';
import {AddToOutfitCard} from './AddToOutfitCard.jsx';
import {ProductCard} from './ProductCard.jsx';

export class OutfitList extends React.Component {
  constructor(props) {
    super(props);

    this.handleLeftArrow = this.handleLeftArrow.bind(this);
    this.handleRightArrow = this.handleRightArrow.bind(this);
    this.shiftViewLeft = this.shiftViewLeft.bind(this);
    this.shiftViewRight = this.shiftViewRight.bind(this);
    this.renderOutfitList = this.renderOutfitList.bind(this);
  }

  handleLeftArrow() {
    this.shiftViewLeft();
  }

  handleRightArrow() {
    this.shiftViewRight();
  }

  shiftViewLeft(position, outfits) {
    var newPosition;
    if (position > 0) {
      newPosition = position - 1;
    } else {
      newPosition = 0;
    }
    var newView = outfits.slice(newPosition, newPosition + 3);

    return [newPosition, newView];
  }

  shiftViewRight(position, outfits) {
    var newPosition;
    if (position < outfits.length - 3) {
      newPosition = position + 1;
    } else {
      newPosition = outfits.length - 3;
    }
    var newView = outfits.slice(newPosition, newPosition + 3);

    return [newPosition, newView];
  }


  renderOutfitList() {
    if (this.props.outfits.length > 0) {
      return (this.props.outfits.map(item => {
        return <OutfitCard key={item.id} itemInfo={item} remove={this.props.remove} />
      }))
    }

  }


  render() {
    return (
      <div>
        <h3>Your Outfit</h3>
        <div className="carousel">
          <AddToOutfitCard add={this.props.add}/>
          <div className="centerVertical">
            {this.props.position > 0 ? <div className="leftArrow" onClick={this.props.left}></div> : null}
          </div>
          {this.renderOutfitList()}
          <div className="centerVertical">
            {this.props.position < this.props.outfits.length -3 ? <div className="rightArrow" onClick={this.props.right}></div> : null}
          </div>
        </div>
      </div>
    )
  }
}