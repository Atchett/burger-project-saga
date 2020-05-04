import React from "react";
import classes from "./Burger.module.css";
import BurgerIngredient from "./BurgerIngredients/BurgerIngredients";

const burger = (props) => {
  // Object.keys transforms into an array of keys
  let transformedIngredients = Object.keys(props.ingredients)
    // map executes a function on each element in the array
    .map((igKey) => {
      // creating an array with the number of each item
      return (
        [...Array(props.ingredients[igKey])]
          // creates the component instance
          .map((_, i) => {
            // ignore the value but using the index to generate a key
            return <BurgerIngredient key={igKey + i} type={igKey} />;
          })
      );
    })
    //flatten the array
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please add ingredients.</p>;
  }

  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default burger;
