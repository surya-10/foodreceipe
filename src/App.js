import logo from './logo.svg';
import './App.css';

import * as yup from "yup";
import { useFormik } from 'formik';
import { useState } from 'react';

let searchVal = yup.object({
  receipe:yup.string().required()
})

function App() {
  let [foodName, setFoodName] = useState("");
  let [result, setResult] = useState(false);
  let [foodList, setFoodList] = useState([]);
  let {values, handleChange, handleSubmit, handleBlur, touched, errors} = useFormik({
    initialValues:{
      receipe:"",
    },
    validationSchema:searchVal,
    onSubmit:(obj)=>{
      setFoodName(obj.receipe);
      getfood(obj.receipe);
    }
  })

  async function getfood(name){
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`,{
      method:"GET"
    })
    let out = await result.json();
    if(out.meals==null){
      setResult(true);
    }
    else if(out.meals.length==0){
      setFoodList("");
      setResult(true);
      
    }
    else{
      setResult(false);
      setFoodList(out.meals)
    }
    
  }

  function openAlert(){
    setResult(false)
    alert("no food found");
    setResult(false)
  }
  return (
    <div className="App">
      <div className='container-fluid'>
        <div className='row cont'>
          <p className='h3 text-light text-uppercase mt-4'>Food Receipes</p>
          <div className='col'>
            <form onSubmit={handleSubmit}>
            <div className='input-grup d-flex flex-column flex-sm-row justify-content-center align-items-center'>
              <input type='text' placeholder='search receipe' className='form-control form-control-sm p-2'
              name='receipe'
              value={values.receipe}
              onChange={handleChange}
              onBlur={handleBlur}/>
              <button className='btn btn-danger ms-2 mt-1' type='submit'>Search</button>
            </div>
            </form>
            {touched.receipe && errors.receipe ? <small className='p-2 rounded text-danger h5'>cannot be empty</small>:""}
            {!result && 
            <div className='receipes d-flex justify-content-center align-items-center flex-wrap mt-3'>
              {foodList.map((val, ind)=>(
                <div className='receipe d-flex justify-content-center align-items-center m-2' key={ind}>
                  <div className='img pt-3'>
                    <img src={val.strMealThumb} />
                    <p>{val.strMeal}</p>
                    <a href={val.strYoutube} target='_blank' className='btn link'>Watch</a>

                    </div>
                  </div>
              ))}
            </div>
            }
            {result==true ? (openAlert()):""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
