import React, { Component } from 'react'
import Button from 'react-bootstrap/button'
import '../App.css';
import Beverage from './Beverage'
import Modal from 'react-bootstrap/Modal'
import CartItem from './CartItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faHeart, faEnvelope, faArchive } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'

const baseAPI = 'http://localhost:3000'

export default class AccountPage extends Component {

    state = {
        allBeverages: null,
        beverageReviews: null,
        showFavorites: false,
        favorites: null,
        orders: null,
        userCart: null,
        showModal: false,
        orderItems: null,
        isVisible: false
    }

    async componentDidMount(){
        this.getAllBeverages()
        this.getReviews()
        this.getFavorites()
        this.getOrders()
        this.isVisible()
        await new Promise(r => setTimeout(r, 200));
        this.getOrderItems()
        this.filterUserCart()
    }

    // componentDidUpdate = (prevProps, prevState) => {
    //     if(prevState.orderItems !==  null){
    //         this.getOrderItems()
    //     }
    // }

    isVisible = () => {
        this.setState({
            isVisible: !this.state.isVisible
        })
    }

    getAllBeverages = () => {
        fetch(baseAPI + '/beverages', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
        })
        .then(response => response.json())
        .then(response => {
            this.setState({
                allBeverages: response
            })
        })
    }

    getOrders = () => {
        fetch(baseAPI + '/orders', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
        })
        .then(response => response.json())
        .then(response => {
            // console.log(response.orders)
            this.setState({
                orders: response.orders
            })
        })
    }

    getOrderItems = () => {
        fetch(baseAPI + '/order_items', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
        })
        .then(response => response.json())
        .then(response => {
            let orderList = response.order_items.filter(item => item.order_id === this.props.user.current_order)
            // console.log(orderList)
            this.setState({
                orderItems: orderList
            })
        })
    }

    filterUserCart = () => {
        if(this.state.orders !== null){
            let userCart = this.state.orders.filter(order => order.user_id === this.props.user.id)
            // console.log(userCart)
            this.setState({
                userCart: userCart
            })
        }
    }

    clearCart = () => {
        fetch(baseAPI + `/users/${this.props.user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                current_order: 0
              })
        })
        .then(response => response.json())
        .then(response => {
            // console.log(response)
        })
        alert("You have succesfully checked out!")
        this.setState({
            showModal: false
        })
    }

    getReviews = () => {
        fetch(baseAPI + '/reviews', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
        })
        .then(response => response.json())
        .then(response => {
            this.setState({
                beverageReviews: response
            })
        })
    }

    filterUserBeverages = () => {
       if(this.state.allBeverages !== null){
        return this.state.allBeverages.filter(beverage => beverage.user_id === this.props.user.id)
       }
    }

    renderUserBeverages = () => {
        if(this.props.user && this.state.allBeverages !== null){
            const beverages = this.filterUserBeverages()
           return beverages.map(beverage => <Beverage beverage={beverage} user={this.props.user} reviews={this.state.beverageReviews} key={beverage.id}/>).reverse()
        }
    }

    handleFavoritesClick = () => {
        this.setState({
            showFavorites: !this.state.showFavorites
        })
    }

    getFavorites = () => {
        fetch(baseAPI + '/favorites', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
        })
        .then(response => response.json())
        .then(response => {
            this.setState({
                favorites: response
            })
        })
    }

    filterUserFavorites = () => {
        if(this.state.favorites !== null){
            return this.state.favorites.filter(favorite => favorite.user_id === this.props.user.id)
        }
    }

    renderFavorites = () => {
        if(this.props.user && this.state.favorites !== null){
            const beverages = this.filterUserFavorites()
           return beverages.map(beverage => <Beverage beverage={beverage} user={this.props.user} reviews={this.state.beverageReviews} key={beverage.id}/>)
        }
    }

    handleModalShow = () => {
        fetch(baseAPI + '/order_items', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
        })
        .then(response => response.json())
        .then(response => {
            let orderList = response.order_items.filter(item => item.order_id === this.props.user.current_order)
            // console.log(orderList)
            this.setState({
                orderItems: orderList,
                showModal: !this.state.showModal
            })
        })
    }

    renderCartItems = () => {
        if(this.state.orderItems !== null){
            return this.state.orderItems.map(cartItem => <CartItem item={cartItem} removeFromCart={this.removeFromCart} key={cartItem.id}/>).reverse()
        } 
    }

    removeItem = () => {
        let newItems = this.state.orderItems.filter(order => order.id !== this.props.item.id)
        this.setState({
            orderItems: newItems
        })
    }

    removeFromCart = () => {
        const token = localStorage.token
        fetch(baseAPI + `/order_items/${this.props.item.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
                'Accept': 'application/json',
              },
        })
        .then(response => response.json())
        .then(response => {
            // console.log(response)
            
        })
    }


    render() {
        const user = this.props.user
        const container = {
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                  staggerChildren: .6,
                  ease: "easeIn", 
                  duration: 1,

              }
            }
          }
        return (
            <motion.div variants={container} initial='hidden' animate='show' className="accountPage">
                <div className='accountPageContainer'>
                    <div className='accountPageLeft'>
                        <div className='accountDetails'>
                        <h3><b>{user ? this.props.user.username : null}</b></h3>
                        <p>{user ? this.props.user.email : null}</p>
                        <button onClick={this.handleModalShow}>Your Cart <FontAwesomeIcon icon={faShoppingCart}/></button>
                        <button onClick={this.handleFavoritesClick}>Favorites <FontAwesomeIcon icon={faHeart}/></button>
                        <button >Change Email <FontAwesomeIcon icon={faEnvelope}/></button>
                        <button >Past Orders <FontAwesomeIcon icon={faArchive}/></button>
                        </div>
                    </div>
                    <motion.div  variants={container} initial="hidden" animate='show' className='accountPageRight'>
                        {this.state.showFavorites ? <h3>Your Favorites</h3> : <h3>Your Beverages</h3>}
        
                        {this.state.showFavorites ? this.renderFavorites() : this.renderUserBeverages()}
                    </motion.div>
                </div>
                <Modal show={this.state.showModal} onHide={this.handleModalShow} className="cartModal">
                <Modal.Header>
                <Modal.Title>Your Cart</Modal.Title>
                     <p>Order ID # <b> {user ? this.props.user.current_order : null}</b></p> 
                </Modal.Header>
                <Modal.Body>
                    {this.renderCartItems()}
                    
                </Modal.Body>
                <Modal.Footer className='cartModalFooter'>
                <p>Order Total: <b>$0.00</b></p>
                <Button variant='primary' size='sm' onClick={this.clearCart}><b>Checkout</b></Button>
                <Button variant="secondary"  size='sm' onClick={this.handleModalShow}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            </motion.div>
        )
    }
}

