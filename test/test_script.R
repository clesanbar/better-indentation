
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
         g = f^2) |>
  # subset to certain cases
  filter(a == 4)

third_data <- second_data |>
  # keep a couple of variables
  select(a, b, c)


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
         g = f^2) |>
  # subset to certain cases
  filter(a == 4)

third_data <- second_data |>
  # keep a couple of variables
  select(a, b, c)
