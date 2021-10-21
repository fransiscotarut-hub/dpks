import styled from "@emotion/styled";

export const Container = styled.div(({ fluid }) => ({
  padding: 12,
  maxWidth: fluid ? undefined : 1000,
  margin: '0 auto'
}));

export const ContainerWithBorder = styled.div(({ fluid }) => ({
  margin: '0 auto',
  borderRadius: 15,
  border: '1px solid #303030',
  overflow: 'hidden'
}));

export const Footer = styled.footer({
  background: '#f5f639',
  padding: 18,
  color: "black"
})
