import styled from "@emotion/styled";

export const Container = styled.div(({ fluid }) => ({
  padding: 12,
  maxWidth: fluid ? undefined : 1000,
  margin: '5px auto'
}));