# Use the official Rust image as a parent image
FROM rust:1-alpine3.19 AS chef

# Install build dependencies
RUN apk add --no-cache musl-dev libc-dev protobuf-dev

# Install cargo-chef
RUN cargo install cargo-chef

# This is important, see https://github.com/rust-lang/docker-rust/issues/85
ENV RUSTFLAGS="-C target-feature=-crt-static"

WORKDIR /app

# Prepare recipe
FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

# Build dependencies - this is the caching Docker layer!
FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

# Build application
COPY . .
# COPY . ../migrations
RUN cargo build --bin server --release
RUN strip target/release/server

# Create the runtime image
FROM alpine:3.19 AS runtime
RUN apk add --no-cache libgcc
COPY --from=builder /app/target/release/server /server
ENTRYPOINT ["/server"]