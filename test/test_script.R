
# This is a script intended to test the IndenteR extension

library(tidyverse)

a <- 1:10
b <- 1:10

# Actual functionality ---------

data <- tibble(a, b) |>
  # create new variables
mutate(c = a + b,
       d = c * 10)


# Intended functionality ----------

data <- tibble(a, b) |>
  # create new variables
  mutate(c = a + b,
         d = c * 10)