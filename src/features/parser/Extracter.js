/**
 * Extracts relevant information from a file object.
 * @param {object} file - The file object containing elements to be extracted.
 * @returns {object} - An object containing the extracted information.
 */
export default function extractRathCoSaleOrder(file) {
  //using the sampleData object, extract the elements array into its own object
  const { elements } = file;

  // remove any elements that do not have Bounds or Text properties
  const filteredElements = elements.filter(
    (element) => element.Bounds && element.Text
  );

  ////////////////////////////////////////////////////////////////////////
  // ORDER DETAILS
  // group the filtered elements by the first number in the Bounds array to the nearest 10
  const groupedElements1 = filteredElements.reduce((acc, element) => {
    const key = Math.floor(element.Bounds[0] / 10) * 10;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(element);
    return acc;
  }, {});

  // if there is an array named 670, join it onto 660
  if (groupedElements1[670]) {
    groupedElements1[660].push(...groupedElements1[670]);
    delete groupedElements1[670];
  }

  // sort the array named 660 by the second number in the Bounds array
  groupedElements1[660].sort((a, b) => b.Bounds[1] - a.Bounds[1]);

  // in the array named 660, if the second number in the Bounds array is less than 300, remove the element
  groupedElements1[660] = groupedElements1[660].filter(
    (element) => element.Bounds[1] >= 300
  );

  // if array 660 only has 5 elements, add a new element with the Text property "", and then swap the last two elements
  if (groupedElements1[660].length === 5) {
    groupedElements1[660].push({ Text: "", Bounds: [669, 355, 664, 359] });
    [groupedElements1[660][4], groupedElements1[660][5]] = [
      groupedElements1[660][5],
      groupedElements1[660][4],
    ];
  }

  // create a new object called orderDetails, with the keys as the Text property in array 560, and the values as the Text property in array 660
  const orderDetails = groupedElements1[560].reduce((acc, element, index) => {
    acc[element.Text] = groupedElements1[660][index].Text;
    return acc;
  }, {});

  // trim the values in the orderDetails object
  Object.keys(orderDetails).forEach((key) => {
    orderDetails[key] = orderDetails[key].trim();
  });

  // with the keys of orderDetails, remove any "", ":" and excess spaces from the key names
  Object.keys(orderDetails).forEach((key) => {
    orderDetails[key.replace(/"|:|\s+/g, "")] = orderDetails[key];
    delete orderDetails[key];
  });

  // console log the keys and values in the orderDetails object
  // console.log(orderDetails);
  ////////////////////////////////////////////////////////////////////
  // DELIVERY ADDRESS
  // with the filteredElements array, keep the elements that:
  // - have a Bounds array with the first number > 290
  // - have a Bounds array with the second number < 430
  // - have a Bounds array with the third number < 400
  // - have a Bounds array with the fourth number > 350
  const deliveryAddress = filteredElements.filter(
    (element) =>
      element.Bounds[0] > 280 &&
      element.Bounds[1] < 420 &&
      element.Bounds[2] < 410 &&
      element.Bounds[3] > 340
  );

  ////////////////////////////////////////////////////////////////////////
  // ORDER ITEMS
  // with the filteredElements array, keep the elements that:
  // - have a Bounds array with the first number > 30
  // - have a Bounds array with the second number < 300
  // - have a Bounds array with the third number < 120
  // - have a Bounds array with the fourth number > 130
  const orderItems = filteredElements.filter(
    (element) => element.Bounds[1] < 300 && element.Bounds[3] > 130
  );

  // with orderItems, group the elements by the second number in the Bounds array to the nearest 11, starting from the smallest second number in the Bounds array in the whole orderItems array
  const groupedElements2 = orderItems.reduce((acc, element) => {
    const key = Math.floor(element.Bounds[1] / 11) * 11;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(element);
    return acc;
  }, {});

  // for each key in groupedElements2, extract the Text property and join it into a single string
  const orderItemsText = Object.keys(groupedElements2).map((key) =>
    groupedElements2[key].map((element) => element.Text).join(" ")
  );

  //trim the orderItemsText array
  const trimmedOrderItemsText = orderItemsText.map((text) => text.trim());

  //remove excess spaces from the trimmedOrderItemsText array
  trimmedOrderItemsText.forEach((text, index) => {
    trimmedOrderItemsText[index] = text.replace(/\s+/g, " ");
  });

  // with the trimmedOrderItemsText array, create a new object called orderItemsArray with:
  // - the first key as "Code", with the value as the first word in the string
  // - the second key as "Batch", with the value as the word in the string that starts with "RC" followed by characters
  // - the third key as "Quantity", with the value being the next word in the string after the RC word
  // do this for all strings in the trimmedOrderItemsText array
  const orderItemsArray = trimmedOrderItemsText.map((text) => {
    const words = text.split(" ");
    return {
      Code: words[0],
      Batch: words.find((word) => word.match(/^RC/)),
      Quantity:
        words[words.indexOf(words.find((word) => word.match(/^RC/))) + 1],
    };
  });

  ///////////////////////////////////////////////////////////////////////////
  // SPECIAL INSTRUCTIONS
  // with the filteredElements array, keep the elements that:
  // - have a Bounds array with the second number < 110
  // - have a Bounds array with the fourth number > 90
  const specialInstructions = filteredElements
    .filter((element) => element.Bounds[1] < 110 && element.Bounds[3] > 90)
    .map((element) => element.Text)
    .reduce((acc, text) => {
      acc += text;
      return acc;
    }, "");

  return {
    specialInstructions,
    orderDetails,
    deliveryAddress,
    trimmedOrderItemsText,
    orderItemsArray,
  };
}
