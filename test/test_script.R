
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
                       b == 2 ~ 3,
                       c == 3 ~ 4,
                       TRUE ~ 5),
         # when the variable is created in the middle of the function, indentation works well
         i = case_when(
           a == 1 ~ 2,
           b == 2 ~ 3
         )) |>
  # but now it changes when it is the start of the function, indentation is different
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
                       b == 2 ~ 3,
                       c == 3 ~ 4,
                       TRUE ~ 5),
         # when the variable is created in the middle of the function, indentation works well
         i = case_when(
           a == 1 ~ 2,
           b == 2 ~ 3
         )) |>
  # and now when the varaible is created at the start of the function, indentation should look like this too
  mutate(j = case_when(
           a == 1 ~ 2,
           b == 2 ~ 3
         ))
