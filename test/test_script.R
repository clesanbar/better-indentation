
# This is a script intended to test the indentR extension

library(tidyverse)

a <- 1:10
b <- 1:10

# Current implementation ---------

data <- tibble(a, b) |>
  # create new variables
  mutate(
    c = a + b,
    d = c * 10
  )

second_data <- data |>
  # create new variables
  mutate(f = c * d,
         g = f ^ 2) |>
  # subset to certain cases
  filter(a == 4)

third_data <- second_data |>
  # keep a couple of variables
  select(a, b, c) |>
  # test using the case_when function with RStudio-like indenting
  mutate(h = case_when(a == 1 ~ 2,
                       b == 2 ~ 3),
         # when the variable is created in the middle of the function, indentation works well
         i = case_when(
           a == 1 ~ 2,
           b == 2 ~ 3
         )) |>
  # and now let's test whether the nested function indenting works well at the start (almost)
  mutate(j = case_when(
           a == 1 ~ 2,
           b == 2 ~ 3
  ))


# Intended functionality ----------

data <- tibble(a, b) |>
  # create new variables
  mutate(
    c = a + b,
    d = c * 10
  )

second_data <- data |>
  # create new variables
  mutate(f = c * d,
         g = f ^ 2) |>
  # subset to certain cases
  filter(a == 4)

third_data <- second_data |>
  # keep a couple of variables
  select(a, b, c) |>
  # test using the case_when function with RStudio-like indenting
  mutate(h = case_when(a == 1 ~ 2,
                       b == 2 ~ 3),
         # when the variable is created in the middle of the function, indentation works well
         i = case_when(
           a == 1 ~ 2,
           b == 2 ~ 3
         )) |>
  # this is how the nested indentation should work, including the position of the parentheses
  mutate(j = case_when(
           a == 1 ~ 2,
           b == 2 ~ 3
         ))
