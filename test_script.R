
# This is a script intended to test the indenter

library(tidyverse)

a <- 1:10
b <- 1:10

data <- tibble(a,
               b) |>
                # create a new variable
              mutate(c = a + b,
                     d = c*10)