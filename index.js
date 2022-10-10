import { tweetsData as tweets} from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let tweetsData = [...tweets]

if(localStorage.getItem('tweets')){
    tweetsData = JSON.parse(localStorage.getItem('tweets'))
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like)
        handleLikeClick(e.target.dataset.like) 
    else if(e.target.dataset.retweet)
        handleRetweetClick(e.target.dataset.retweet)
    else if(e.target.dataset.replies)
        handleReplyIconClick(e.target.dataset.replies)
    else if(e.target.id === 'tweet-btn')
        handleTweetBtnClick()
    else if(e.target.dataset.reply)
        handleReplyBtnClick(e.target.dataset.reply)
    else if(e.target.dataset.del)
        handleDeleteTweet(e.target.dataset.del)
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyIconClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Frances`,
            profilePic: `images/profilePick.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        })
        saveToStorage()
        render()
        tweetInput.value = ''
    }
}

function handleReplyBtnClick(replyUuid){
    const input = document.getElementById(`tweet-input-${replyUuid}`)
    const newReply = {
        handle: `@Frances ✅`,
        profilePic: `images/profilePick.jpg`,
        tweetText: input.value,
    }
    const targetTweet = tweetsData.filter((tweet)=>{
        return replyUuid === tweet.uuid
    })[0]
    targetTweet.replies.unshift(newReply)
    input.value = ''
    saveToStorage()
    render()
}

function handleDeleteTweet(tweetId){
    const targetTweet = tweetsData.map((tweet)=>tweet.uuid).indexOf(tweetId)
    tweetsData.splice(targetTweet, 1)
    saveToStorage()
    render()
}

function saveToStorage(){
    localStorage.setItem('tweets', JSON.stringify(tweetsData))
}

function getFeedHtml(){

    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let repliesHtml =''

        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="container replies">
                    <img src="${reply.profilePic}" class="icon">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                </div>
                `
            })
        }
        repliesHtml += `
            <div class="reply">
                <textarea placeholder="Tweet your reply" id="tweet-input-${tweet.uuid}"></textarea>
                <button 
                    class="reply-btn" 
                    data-reply="${tweet.uuid}"
                >Reply</button>
            </div>
            `

        feedHtml += `
            <div class="container default-padding">
                <div class="deleteBtn">
                    <button id="del-btn${tweet.uuid}" data-del="${tweet.uuid}">X</button>
                </div>
                <img src="${tweet.profilePic}" class="icon">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                                data-replies="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                            ></i>
                                ${tweet.retweets}
                        </span>
                    </div>
                </div>
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
            </div> 
            `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()