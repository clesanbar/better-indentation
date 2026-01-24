
# Against air

[`air`](https://tidyverse.org/blog/2025/02/air/) is one of the most popular code formatters available for R. I admire the research team behind it, and I'm glad it exists for people that use it. I'm sure they get a lot out of it. I also appreciate that it is an opinionated software package. However, being an opinionated software package is only a good thing when that opinion is good. I don't think this is the case with `air`, and I'll explain why below.

### Air code obscures hierarchy

Consider the following R code:

```
data_new <- data_old |>
  # combine with another data set
  left_join(data_alt |>
              # select relevant variables
              select(var_1, var_2) |>
              # make compatible for the join
              mutate(var_1 = as.integer(var_1),
                     # create a third variable
                     var_3 = var_2 * 2)) |>
  # obtain all combinations of the variables
  complete(var_1, var_2, var_3)

```

Now, you might think that this is not how someone should write code. I personally disagree, I think it flows very naturally, especially when you need to make on-the-fly modifications where creating a new object would not only be overkill, but introduce opportunities for more errors. Moreover, this is the default way that indentation works in RStudio, unless one hits enter inside an empty function. However, even if this is not how someone *should* write code, if they do, the indentation should respect the hierarchy of the code that they've written. Now let's compare this with code formatted using `air`.

```
data_new <- data_old |>
  # combine with another data set
  left_join(
    data_alt |>
      # select relevant variables
      select(var_1, var_2) |>
      # make compatible for the join
      mutate(
        var_1 = as.integer(var_1),
        # create a third variable
        var_3 = var_2 * 2
      )
  ) |>
  # obtain all combinations of the variables
  complete(var_1, var_2, var_3)

```

In this case, `air` makes the hierarchy of what is going on harder to see.

### Air code wastes vertical space

Consider the additional lines that are added, with no real gain in readability or else. In fact, I believe this makes code harder to read, while also wasting vertical space.

### Air code looks ugly

This is probably subjective, but when you compare a block of code written using `air` with one written with regular RStudio indentation, the former looks pretty ugly.
