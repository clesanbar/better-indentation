
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

second_data <- tibble(a) |>
  # create new variables
  mutate(f = a^2,
         g = f*3) |>
  # subset to certain cases
  filter(a == 4)

third_data <- data |>
  # merge with other data set
  left_join(second_data |>
              # change the variable mid pipe
              mutate(a = a + 2)) |>
  # remove missing values
  drop_na(f)


# Intended functionality ----------

data <- tibble(a, b) |>
  # create new variables
  mutate(
    c = a + b,
    d = c * 10
  )

second_data <- tibble(a) |>
  # create new variables
  mutate(f = a^2,
         g = f*3) |>
  # subset to certain cases
  filter(a == 4)

third_data <- data |>
  # merge with other data set
  left_join(second_data |>
              # change the variable mid pipe
              mutate(a = a + 2)) |>
  # remove missing values
  drop_na(f)
