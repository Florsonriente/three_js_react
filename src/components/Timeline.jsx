import React, { Suspense } from "react";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";

const TimelineContainer = styled.div`
  width: 100%;
  height: auto;
  overflow: auto;
  padding: 50px 0;
  background: #111;
  color: white;
  text-align: center;
`;

const TimelineItem = styled.div`
  width: 30%;
  padding: 30px;
  margin: 20px auto;
  position: relative;
  background-color: rgba(40, 40, 44, 0.35);
  border-radius: 15px;
  text-align: left;
  transition: 0.5s ease-in-out;

  &:hover {
    background: rgb(0, 0, 0);
  }

  &::before {
    content: "";
    position: absolute;
    left: -15px;
    top: 50%;
    width: 20px;
    height: 20px;
    background-color: rgb(199, 22, 84);
    border-radius: 50%;
    transform: translateY(-50%);
  }
`;

const Title = styled.h3`
  font-size: 22px;
  font-weight: 700;
  text-transform: uppercase;
`;

const Description = styled.p`
  font-size: 1em;
  font-weight: 300;
  margin: 10px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px 5px 0 0;
  background-color: #c71654;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff4081;
  }
`;

const timelineData = [
  {
    year: "8 years in Brand Management in FMCG",
    description: `Employed by FLAYR and Suedlich-t Agencies as an Art Director.
      Realized web projects for company's websites and clients. 
      Participated in creative content tasks for Henkel, Oral-B, Swiss Banks.
      Completed a Front-end Web Development Course at Redi School.`,
  },
  {
    year: "4 years enthusiastic self-learning web development",
    description: `Relocated to Germany. Learned German from A0 to 
      <a href='../projekt/docs/deutsch.jpg' target='_blank'>C1 level</a>. 
      Studied Media Design at Wildner Akademie. Launched a personal website 
      and created brand concepts in Adobe programs.`,
  },
  {
    year: "3 years of AI Art Direction by well-known brands",
    description: `Built a career in Brand Management at FMCG companies in Russia & Ukraine.
      Managed projects for Listerine, Gliss Kur, and SYOSS Brands. 
      Discovered a passion for oil painting and sold artworks.`,
  }
];

const Timeline = () => {
  const handleButtonClick = (year) => {
    alert(`Learn more about: ${year}`);
  };

  const handleCertificatesClick = (year) => {
    alert(`View certificates for: ${year}`);
  };

  return (
    <>
      <Canvas resize={{ scroll: false }} style={{ width: "100%", height: "auto", marginTop: "18em" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={1} />

        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <Text
              fontSize={9}
              color="white"
              lineHeight={1}
              textAlign="center"
              font="/fonts/Sunwish Maverick.ttf"
              anchorX="center"
              anchorY="middle"
            >
              My Expertise
            </Text>
          </group>
        </Suspense>
      </Canvas>

      <TimelineContainer>
        {timelineData.map((item, index) => (
          <TimelineItem key={index}>
            <Title>{item.year}</Title>
            <Description dangerouslySetInnerHTML={{ __html: item.description }} />
            <Button onClick={() => handleButtonClick(item.year)}>Learn More</Button>
            <Button onClick={() => handleCertificatesClick(item.year)}>Certificates</Button>
          </TimelineItem>
        ))}
      </TimelineContainer>
    </>
  );
};

export default Timeline;
