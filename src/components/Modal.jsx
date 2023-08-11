import styled from 'styled-components'
import { AiOutlineClose,AiOutlineSearch } from 'react-icons/ai'

function Modal({show,toggle}) {
    return (
        <>
          {show && 
            <Overlay>
                <ModalContainer>
                    <ModalHeader>
                        <SubModalHeader>
                            <CloseButton onClick={()=>toggle(false)}>
                                <AiOutlineClose></AiOutlineClose>
                            </CloseButton>
                            <h3>Nuevo mensaje</h3>
                        </SubModalHeader>
                        <NextButton>
                            Siguiente
                        </NextButton>
                    </ModalHeader>
                    <ModalSearch>
                        <AiOutlineSearch></AiOutlineSearch>
                        <input type="text" placeholder='Buscar personas'/>
                    </ModalSearch>
                </ModalContainer>
            </Overlay>
        }
        </>
    )
}

export default Modal

const Overlay = styled.div`
    width:100vw;
    height:100vh;
    position:fixed;
    top:0;
    left:0;
    background:rgba(0,0,0,.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding:40px;
`;

const ModalContainer = styled.div`
    width: 600px;
    min-height: 500px;
    background:rgba(255,255,255);
    position: relative;
    border-radius: 15px;
    box-shadow: rgba(100,100,111,0.2) 0px 7px 29px 0px;
    padding: 20px;
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;

`;

const CloseButton = styled.div`
    font-size: 20px;
    cursor: pointer;    
    height: 20px;        
`;


const SubModalHeader = styled.div`
    display: flex;        
    width: 15vw;
    justify-content: space-between;    
    font-size: 18px;
    align-items: center;
`;


const NextButton = styled.div`
    color: white;
    font-weight: bold;
    background: gray;
    padding: 1% 2%;
    border-radius: 15px;
    cursor: pointer;
`;

const ModalSearch = styled.div`
  width: 100%;
  height: 7vh;  
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 22px;
  border-bottom: solid 1px gainsboro;
  color: rgb(29, 155, 240);
  input{
    width: 93%;
    height: 80%;
    font-size: 15px;
    border: none;
  }  
`;