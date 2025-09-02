let scorestr = localStorage.getItem('score');
        let score = JSON.parse(scorestr) || {
            win : 0,
            lost: 0,
            tie : 0,
        };;

        function generateComputerChoice() {
            let randNo = Math.floor(Math.random() * 3);
            let computerChoice;
            if (randNo == 0) {
                computerChoice = 'Bat';
            } else if (randNo == 1) {
                computerChoice = 'Ball';
            } else {
                computerChoice = 'Stump';
            }
            return computerChoice;
        }

        function getResult(userMove, computerMove) {                // M1
            let resultMsg;
            if (computerMove === userMove) {
                resultMsg = `It's a tie`;
                score.tie++;
            } else if ((computerMove === 'Bat' && userMove === 'Stump') || (computerMove === 'Ball' && userMove === 'Bat') || (computerMove === 'Stump' && userMove === 'Ball')) {
                resultMsg = `you Won!`;
                score.win++;
            } else if ((computerMove === 'Bat' && userMove === 'Ball') || (computerMove === 'Stump' && userMove === 'Bat') || (computerMove === 'Ball' && userMove === 'Stump')) {
                resultMsg = `You Lost`;
                score.lost++;
            }
            return resultMsg;
        }

        function showResult(userMove,computerMove,result){
        // storing in local storage
            localStorage.setItem('score',JSON.stringify(score));
            // show moves and result and score on page
            document.querySelector('#user-move').innerText = 
            userMove !== undefined ? `You have chosen ${userMove}`: '';
            document.querySelector('#computer-move').innerText = computerMove ?`Computer choice is ${computerMove} `: '';
            document.querySelector('#result').innerText = result || '';
            document.querySelector('#score').innerText = `Your Score:

            Won: ${score.win}
            Lost: ${score.lost}
            Tie: ${score.tie}
            `;

            // alert(`You have chosen ${userMove}. \nComputer choice is ${computerMove} \n${result

            // Your Score:
            // won: ${score.win}
            // lost: ${score.lost}
            // tie: ${score.tie}`
            // );
            // console.log(score);
        }
                                    // M2 using Nested if

        // function getResult(userMove, computerMove) {
        //     let resultMsg;
        //     if (userMove === 'Bat') {
        //         if(computerMove === 'Ball'){
        //             return 'You Won!'
        //         } else if(computerMove === 'Bat'){
        //             return `It's a tie`
        //         } else if(computerMove === 'Stump'){
        //             return `You Lost`
        //         }
        //     }
        //     else if (userMove === 'Ball') {
        //         if(computerMove === 'Ball'){
        //             return `It's a tie`
        //         } else if(computerMove === 'Bat'){
        //             return `You Lost`
        //         } else if(computerMove === 'Stump'){
        //             return 'You Won!'
        //         }
        //     }
        //     else if (userMove === 'Stump') {
        //         if(computerMove === 'Ball'){
        //             return `You Lost`
        //         } else if(computerMove === 'Bat'){
        //             return `You Won!`
        //         } else if(computerMove === 'Stump'){
        //             return `It's a tie`
        //         }
        //     }
        // }