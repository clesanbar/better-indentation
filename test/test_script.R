
# This is a script intended to test the indentR extension

library(tidyverse)

a <- 1:10
b <- 1:10

# Current implementation ---------

data <- tibble(a,b) |>
  # create new variables
  mutate(c = c + b,
         d = c * 10)

         second_data <- data |>
           # create new variables
           mutate(f = c * d) |>
             # subset to certain cases
             filter(a == 4) |>
               # and then keep a couple of variables
               select(a, b, c)


# Intended functionality ----------

data <- tibble(a,b) |>
  # create new variables
  mutate(c = c + b,
         d = c * 10)

second_data <- data |>
  # create new variables
  mutate(f = c * d) |>
  # subset to certain cases
  filter(a == 4) |>
  # and then keep a couple of variables
  select(a, b, c)
