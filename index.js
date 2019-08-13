const axios = require('axios');

// make the array that we'll push our responses into
let arr = []

// hitting the api function
const getData = async (nextEndpoint) => {
  // sometimes we don't get the next endpoint
  let endpoint;
  if (nextEndpoint === undefined) {
    endpoint = '/api/products/1'
  } else {
    endpoint = nextEndpoint
  }
  const url = `http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com${endpoint}`
  return await axios.get(url)
}

const accessData = async (nextEndpoint) => {
  if (arr.length === 0) {
    // nextEndpoint doesn't exist here
    const result = await getData()
    arr.push(result.data)
    // accessData will now take a nextEndpoint as an argument
    accessData(result.data.next)
  } else {
    // here next endpoint does exist
    const result = await getData(nextEndpoint)
    arr.push(result.data)
    if (result.data.next === null) {
      // if it is null then we run our filtering functions
      const products = getOnlyProducts(arr)
      // ensuring that we only have product objects in our array, no next strings
      const airConditioners = filterAirconditioners(products)
      //console.log(airConditioners)
      const cubicWeight = []
      airConditioners.forEach((item)=>{
        cubicWeight.push(Number((item.size.width/100*item.size.length/100*item.size.height/100).toFixed(2)))
      })
      const cubicWeightLength = cubicWeight.length
      //const averageCubicWeight = cubicWeight/cubicWeightLength*250

      const sum = cubicWeight.reduce((total, amount) => total + amount); 
      const averageCubicWeight = sum/cubicWeight.length*250;
      console.log(averageCubicWeight)

    } else {
      // we call access data again with the nextEndpoint as an argument
      accessData(result.data.next)
    }
  }
}

const getOnlyProducts = (arr) => {
  const products = []
  arr.forEach((data) => {
    data.objects.forEach((product) => {
      products.push(product)
    })
  })
  //console.log(products)
  return products
}

const filterAirconditioners = (products) => {
  return products.filter((product) => {
    //console.log(product.category)
    return product.category === "Air Conditioners"
  })
}

// start program
accessData()
