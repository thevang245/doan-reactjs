import styled from "styled-components";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Container = styled.div`
  padding-top: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  text-align: center;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
`;

const Title = styled.h3`
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 20px;
`;

const InfoText = styled.p`
  font-size: 18px;
  color: #555;
  margin: 5px 0;
`;

const Button = styled.a`
  display: inline-block;
  padding: 10px 20px;
  background-color: black;
  color: white; /* Sửa text-color thành color */
  text-decoration: none;
  border-radius: 5px;
  margin-top: 20px;
  
  &:hover {
    background-color: #333333;
  }
`;

function Infor() {
  const infor = useSelector((state) => state.user.info);
  const loginStatus = useSelector((state) => state.user.login);

  let dangxuat = () => {
    localStorage.removeItem('loginStatus')
    alert('Đăng xuất thành công');
    window.location.reload();
  }
  
  
  return (
    <Container>
      {loginStatus=== true? (<>
        <Title>Thông tin tài khoản</Title>
      <Avatar src={infor.image } alt="" />
      <InfoText>{infor.firstName +' '+ infor.lastName}</InfoText>
      <InfoText>{infor.email}</InfoText>
      <InfoText>{infor.gender === 'male'? 'Nam' : 'Nữ'}</InfoText>
      <Button onClick={dangxuat} >Đăng xuất</Button>
      </>) 
      : 'Bạn chưa đăng nhập!'}
      

      
    </Container>
  );
}

export default Infor;
