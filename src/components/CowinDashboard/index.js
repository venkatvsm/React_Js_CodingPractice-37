// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

class CowinDashboard extends Component {
  state = {apiStatus: '', productList: []}

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({apiStatus: 'LOADING'})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const last7DaysVaccination = data.last_7_days_vaccination.map(eachItem => ({
        dose1: eachItem.dose_1,
        dose2: eachItem.dose_2,
        vaccineDate: eachItem.vaccine_date,
      }))
      const vaccinationByAge = data.vaccination_by_age.map(item => ({
        age: item.age,
        count: item.count,
      }))
      const vaccinationByGender = data.vaccination_by_gender.map(each => ({
        count: each.count,
        gender: each.gender,
      }))
      const updatedData = {
        last7DaysVaccination,
        vaccinationByAge,
        vaccinationByGender,
      }
      this.setState({apiStatus: 'SUCCESS', productList: updatedData})
    } else {
      this.setState({apiStatus: 'FAILURE'})
    }
  }

  renderSuccessView = () => {
    const {productList} = this.state
    const {last7DaysVaccination, vaccinationByGender, vaccinationByAge} =
      productList
    return (
      <div className="cardsListContainer">
        <VaccinationCoverage last7DaysVaccination={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        <VaccinationByAge vaccinationByAge={vaccinationByAge} />
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="spinner_loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'LOADING':
        return this.renderLoader()
      case 'SUCCESS':
        return this.renderSuccessView()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg_container">
        <div className="logocontainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="websiteLogo"
          />
          <h1 className="Logo_heading">Co-WIN</h1>
        </div>
        <h1 className="heading">CoWIN Vaccination in India</h1>
        {this.renderAllProducts()}
      </div>
    )
  }
}
export default CowinDashboard
